const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create new cart
exports.createCart = async (req, res) => {
  try {
    const cartId = uuidv4();
    
    await pool.query(`
      INSERT INTO carts (id) VALUES ($1)
    `, [cartId]);

    res.json({
      cart: {
        id: cartId,
        checkoutUrl: `/checkout/${cartId}`,
        cost: {
          subtotalAmount: { amount: '0', currencyCode: 'VND' },
          totalAmount: { amount: '0', currencyCode: 'VND' },
          totalTaxAmount: { amount: '0', currencyCode: 'VND' }
        },
        lines: [],
        totalQuantity: 0
      }
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartResult = await pool.query(`
      SELECT * FROM carts WHERE id = $1
    `, [id]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemsResult = await pool.query(`
      SELECT 
        ci.*,
        p.title as product_title,
        p.handle as product_handle,
        p.featured_image_url,
        p.featured_image_alt,
        pv.title as variant_title,
        pv.price_amount,
        pv.price_currency,
        (
          SELECT json_agg(jsonb_build_object(
            'name', pvo.name,
            'value', pvo.value
          ))
          FROM product_variant_options pvo
          WHERE pvo.variant_id = ci.variant_id
        ) as variant_options
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.cart_id = $1
    `, [id]);

    const lines = itemsResult.rows.map(item => ({
      id: item.id,
      quantity: item.quantity,
      cost: {
        totalAmount: {
          amount: (item.price_amount * item.quantity).toString(),
          currencyCode: item.price_currency
        }
      },
      merchandise: {
        id: item.variant_id,
        title: item.variant_title,
        selectedOptions: item.variant_options || [],
        product: {
          id: item.product_id,
          handle: item.product_handle,
          title: item.product_title,
          featuredImage: {
            url: item.featured_image_url,
            altText: item.featured_image_alt,
            width: 800,
            height: 800
          }
        }
      }
    }));

    const totalAmount = lines.reduce((sum, line) => 
      sum + parseFloat(line.cost.totalAmount.amount), 0
    );

    const cart = {
      id: cartResult.rows[0].id,
      checkoutUrl: `/checkout/${id}`,
      cost: {
        subtotalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
        totalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
        totalTaxAmount: { amount: '0', currencyCode: 'VND' }
      },
      lines,
      totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0)
    };

    res.json({ cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { merchandiseId, quantity = 1 } = req.body;

    // Get variant and product info
    const variantResult = await pool.query(`
      SELECT pv.*, p.id as product_id
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE pv.id = $1
    `, [merchandiseId]);

    if (variantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product variant not found' });
    }

    const variant = variantResult.rows[0];
    const lineId = uuidv4();

    // Check if item already exists in cart
    const existingItem = await pool.query(`
      SELECT * FROM cart_items
      WHERE cart_id = $1 AND variant_id = $2
    `, [id, merchandiseId]);

    if (existingItem.rows.length > 0) {
      // Update quantity
      await pool.query(`
        UPDATE cart_items
        SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
        WHERE cart_id = $2 AND variant_id = $3
      `, [quantity, id, merchandiseId]);
    } else {
      // Add new item
      await pool.query(`
        INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity)
        VALUES ($1, $2, $3, $4, $5)
      `, [lineId, id, variant.product_id, merchandiseId, quantity]);
    }

    // Return updated cart
    return exports.getCart(req, res);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update cart items
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { lines } = req.body;

    for (const line of lines) {
      if (line.quantity === 0) {
        await pool.query(`
          DELETE FROM cart_items
          WHERE id = $1 AND cart_id = $2
        `, [line.id, id]);
      } else {
        await pool.query(`
          UPDATE cart_items
          SET quantity = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2 AND cart_id = $3
        `, [line.quantity, line.id, id]);
      }
    }

    return exports.getCart(req, res);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id, lineId } = req.params;

    await pool.query(`
      DELETE FROM cart_items
      WHERE id = $1 AND cart_id = $2
    `, [lineId, id]);

    return exports.getCart(req, res);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── User-based cart (dùng user_id từ JWT) ────────────────────────────────

// Lấy hoặc tạo cart của user
async function getOrCreateUserCart(userId) {
  let cartResult = await pool.query(
    'SELECT id FROM carts WHERE user_id = $1',
    [userId]
  );
  if (cartResult.rows.length > 0) return cartResult.rows[0].id;

  const newCartId = uuidv4();
  await pool.query(
    'INSERT INTO carts (id, user_id) VALUES ($1, $2)',
    [newCartId, userId]
  );
  return newCartId;
}

// Helper: format cart items giống getCart nhưng dùng cart_id
async function formatCartById(cartId) {
  const itemsResult = await pool.query(`
    SELECT 
      ci.*,
      p.title as product_title,
      p.handle as product_handle,
      p.price_amount,
      p.price_currency,
      COALESCE(
        (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.position LIMIT 1),
        p.featured_image_url
      ) as image_url,
      p.featured_image_alt
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $1
  `, [cartId]);

  const lines = itemsResult.rows.map(item => ({
    id: item.id,
    quantity: item.quantity,
    cost: {
      totalAmount: {
        amount: (item.price_amount * item.quantity).toString(),
        currencyCode: item.price_currency
      }
    },
    merchandise: {
      id: item.product_id,
      product: {
        id: item.product_id,
        handle: item.product_handle,
        title: item.product_title,
        featuredImage: {
          url: item.image_url,
          altText: item.featured_image_alt,
          width: 800, height: 800
        }
      }
    }
  }));

  const totalAmount = lines.reduce((s, l) => s + parseFloat(l.cost.totalAmount.amount), 0);
  return {
    id: cartId,
    checkoutUrl: '/checkout',
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
      totalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
      totalTaxAmount: { amount: '0', currencyCode: 'VND' }
    },
    lines,
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0)
  };
}

// GET /api/cart/my
exports.getMyCart = async (req, res) => {
  try {
    const cartId = await getOrCreateUserCart(req.user.userId);
    const cart = await formatCartById(cartId);
    res.json({ cart });
  } catch (error) {
    console.error('Error getting user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/cart/my/items  { productId, quantity }
exports.addToMyCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ error: 'productId là bắt buộc' });

    const cartId = await getOrCreateUserCart(userId);

    const existing = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2',
        [quantity, existing.rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES ($1, $2, $3, $4)',
        [uuidv4(), cartId, productId, quantity]
      );
    }

    const cart = await formatCartById(cartId);
    res.json({ cart });
  } catch (error) {
    console.error('Error adding to user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/cart/my/items  { lines: [{id, quantity}] }
exports.updateMyCart = async (req, res) => {
  try {
    const cartId = await getOrCreateUserCart(req.user.userId);
    const { lines } = req.body;

    for (const line of lines) {
      if (line.quantity === 0) {
        await pool.query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [line.id, cartId]);
      } else {
        await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2 AND cart_id = $3', [line.quantity, line.id, cartId]);
      }
    }

    const cart = await formatCartById(cartId);
    res.json({ cart });
  } catch (error) {
    console.error('Error updating user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/cart/my/items/:lineId
exports.removeFromMyCart = async (req, res) => {
  try {
    const cartId = await getOrCreateUserCart(req.user.userId);
    await pool.query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [req.params.lineId, cartId]);
    const cart = await formatCartById(cartId);
    res.json({ cart });
  } catch (error) {
    console.error('Error removing from user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
