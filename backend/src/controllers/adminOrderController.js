const pool = require('../config/database');
const { sendOrderCancelEmail } = require('../config/resend');

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};

// Lấy danh sách đơn hàng (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (status && STATUS_LABELS[status]) {
      params.push(status);
      whereClause = `WHERE o.status = $${params.length}`;
    }

    params.push(limit, offset);

    const result = await pool.query(`
      SELECT 
        o.id,
        o.status,
        o.total_amount,
        o.shipping_address,
        o.phone,
        o.note,
        o.created_at,
        o.updated_at,
        u.full_name as customer_name,
        u.email as customer_email,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id, u.full_name, u.email
      ORDER BY o.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    // Đếm tổng
    const countParams = status ? [status] : [];
    const countWhere = status ? 'WHERE status = $1' : '';
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM orders ${countWhere}`, countParams
    );

    res.json({
      orders: result.rows.map(row => ({
        id: row.id,
        status: row.status,
        statusLabel: STATUS_LABELS[row.status] || row.status,
        totalAmount: row.total_amount,
        shippingAddress: row.shipping_address,
        phone: row.phone,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        itemCount: parseInt(row.item_count),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách đơn hàng' });
  }
};

// Chi tiết đơn hàng (admin)
exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(`
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at',
      [id]
    );

    const row = orderResult.rows[0];
    res.json({
      order: {
        id: row.id,
        status: row.status,
        statusLabel: STATUS_LABELS[row.status] || row.status,
        totalAmount: row.total_amount,
        shippingAddress: row.shipping_address,
        phone: row.phone,
        note: row.note,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
          phone: row.customer_phone
        },
        items: itemsResult.rows.map(i => ({
          id: i.id,
          productTitle: i.product_title,
          productImage: i.product_image,
          productHandle: i.product_handle,
          quantity: i.quantity,
          price: i.price,
          subtotal: i.quantity * i.price
        }))
      }
    });
  } catch (error) {
    console.error('Get order detail error:', error);
    res.status(500).json({ error: 'Lỗi lấy chi tiết đơn hàng' });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { id } = req.params;
    const { status, reason } = req.body;
    let adminId = null;
    if (req.user && req.user.id) adminId = req.user.id;

    if (!STATUS_LABELS[status]) return res.status(400).json({ error: "Invalid status" });

    await client.query("BEGIN");

    const currentOrderResult = await client.query(
      "SELECT o.*, u.email as user_email, u.full_name as user_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = $1",
      [id]
    );

    if (currentOrderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Not found" });
    }

    const currentOrder = currentOrderResult.rows[0];

    if (currentOrder.status !== status) {
      if (status === "cancelled") {
        const itemsResult = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [id]);
        for (let item of itemsResult.rows) {
          await client.query("UPDATE products SET stock_quantity = COALESCE(stock_quantity, 100) + $1 WHERE id = $2", [item.quantity, item.product_id]);
        }
        if (currentOrder.user_email) {
          await sendOrderCancelEmail(currentOrder.user_email, currentOrder.user_name || "Qu? kh�ch", id, reason);
        }
      }

      const result = await client.query("UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", [status, id]);

      await client.query("INSERT INTO order_logs (order_id, admin_id, action, reason) VALUES ($1, $2, $3, $4)", 
        [id, adminId, "�?i tr?ng th�i t? " + currentOrder.status + " -> " + status, reason || ""]);

      await client.query("COMMIT");

      res.json({ message: "Updated", order: { id: result.rows[0].id, status, statusLabel: STATUS_LABELS[status] } });
    } else {
      await client.query("ROLLBACK");
      res.json({ message: "No change needed", order: { id: currentOrder.id, status, statusLabel: STATUS_LABELS[status] } });
    }
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Update error:", error);
    res.status(500).json({ error: "Update failed" });
  } finally {
    if (client) client.release();
  }
};

// Thống kê số đơn mới (dùng cho polling)
exports.getOrderStats = async (req, res) => {
  try {
    const { since } = req.query; // ISO timestamp

    const pendingResult = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status = 'pending'"
    );

    let newOrdersSince = 0;
    if (since) {
      const newResult = await pool.query(
        "SELECT COUNT(*) FROM orders WHERE created_at > $1",
        [new Date(since)]
      );
      newOrdersSince = parseInt(newResult.rows[0].count);
    }

    res.json({
      pendingCount: parseInt(pendingResult.rows[0].count),
      newOrdersSince,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê' });
  }
};
