const pool = require('../config/database');

// Tạo đơn hàng từ cart của user
exports.createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { shippingAddress, phone, note, cartId } = req.body;

    if (!shippingAddress || !phone) {
      return res.status(400).json({ error: 'Vui lòng nhập địa chỉ và số điện thoại' });
    }

    if (!cartId) {
      return res.status(400).json({ error: 'Không tìm thấy thông tin giỏ hàng' });
    }

    // Lấy cart items kèm thông tin sản phẩm
    const itemsResult = await client.query(`
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        p.id as product_id,
        p.handle as product_handle,
        p.title as product_title,
        p.price_amount,
        p.featured_image_url,
        COALESCE(
          (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.position LIMIT 1),
          p.featured_image_url
        ) as image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    if (itemsResult.rows.length === 0) {
      return res.status(400).json({ error: 'Giỏ hàng trống' });
    }

    const items = itemsResult.rows;
    const totalAmount = items.reduce((sum, item) => 
      sum + (parseFloat(item.price_amount) * item.quantity), 0
    );

    await client.query('BEGIN');

    // Tạo order
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, status, total_amount, shipping_address, phone, note)
      VALUES ($1, 'pending', $2, $3, $4, $5)
      RETURNING *
    `, [userId, totalAmount, shippingAddress, phone, note || null]);

    const order = orderResult.rows[0];

    // Tạo order items (snapshot)
    for (const item of items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_handle, product_title, product_image, quantity, price)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        order.id,
        item.product_id,
        item.product_handle,
        item.product_title,
        item.image_url,
        item.quantity,
        item.price_amount
      ]);
    }

    // Xóa cart items sau khi đặt hàng thành công
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Đặt hàng thành công',
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        shippingAddress: order.shipping_address,
        phone: order.phone,
        createdAt: order.created_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Lỗi tạo đơn hàng' });
  } finally {
    client.release();
  }
};

// Lấy danh sách đơn hàng của user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT 
        o.*,
        json_agg(jsonb_build_object(
          'id', oi.id,
          'productTitle', oi.product_title,
          'productImage', oi.product_image,
          'productHandle', oi.product_handle,
          'quantity', oi.quantity,
          'price', oi.price
        )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    const orders = result.rows.map(row => ({
      id: row.id,
      status: row.status,
      totalAmount: row.total_amount,
      shippingAddress: row.shipping_address,
      phone: row.phone,
      note: row.note,
      createdAt: row.created_at,
      items: row.items || []
    }));

    res.json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách đơn hàng' });
  }
};

// Xem chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        o.*,
        json_agg(jsonb_build_object(
          'id', oi.id,
          'productTitle', oi.product_title,
          'productImage', oi.product_image,
          'productHandle', oi.product_handle,
          'quantity', oi.quantity,
          'price', oi.price
        )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    const row = result.rows[0];
    res.json({
      order: {
        id: row.id,
        status: row.status,
        totalAmount: row.total_amount,
        shippingAddress: row.shipping_address,
        phone: row.phone,
        note: row.note,
        createdAt: row.created_at,
        items: row.items || []
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Lỗi lấy đơn hàng' });
  }
};
