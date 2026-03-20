const pool = require('../config/database');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { query, sortKey = 'CREATED_AT', reverse = 'false' } = req.query;
    
    let sqlQuery = `
      SELECT 
        p.*,
        json_agg(jsonb_build_object(
          'url', pi.url,
          'altText', pi.alt_text,
          'width', pi.width,
          'height', pi.height
        ) ORDER BY pi.position) FILTER (WHERE pi.id IS NOT NULL) as images,
        json_agg(jsonb_build_object(
          'id', pv.id,
          'title', pv.title,
          'price', jsonb_build_object(
            'amount', pv.price_amount::text,
            'currencyCode', pv.price_currency
          ),
          'availableForSale', pv.available_for_sale
        )) FILTER (WHERE pv.id IS NOT NULL) as variants
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
    `;

    const conditions = [];
    const params = [];

    if (query) {
      params.push(`%${query}%`);
      conditions.push(`(p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      sqlQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    sqlQuery += ` GROUP BY p.id`;

    // Sorting
    const orderMap = {
      'CREATED_AT': 'p.created_at',
      'TITLE': 'p.title',
      'PRICE': 'p.price_amount'
    };
    const orderBy = orderMap[sortKey] || 'p.created_at';
    const orderDir = reverse === 'true' ? 'DESC' : 'ASC';
    sqlQuery += ` ORDER BY ${orderBy} ${orderDir}`;

    const result = await pool.query(sqlQuery, params);
    
    const products = result.rows.map(row => ({
      id: row.id,
      handle: row.handle,
      title: row.title,
      description: row.description,
      availableForSale: row.available_for_sale,
      priceRange: {
        maxVariantPrice: {
          amount: row.price_amount.toString(),
          currencyCode: row.price_currency
        },
        minVariantPrice: {
          amount: row.price_amount.toString(),
          currencyCode: row.price_currency
        }
      },
      featuredImage: {
        url: row.featured_image_url,
        altText: row.featured_image_alt,
        width: 800,
        height: 800
      },
      images: row.images || [],
      variants: row.variants || [],
      seo: {
        title: row.seo_title || row.title,
        description: row.seo_description || row.description
      }
    }));

    res.json({ products });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product by handle
exports.getProductByHandle = async (req, res) => {
  try {
    const { handle } = req.params;

    const result = await pool.query(`
      SELECT 
        p.*,
        json_agg(jsonb_build_object(
          'url', pi.url,
          'altText', pi.alt_text,
          'width', pi.width,
          'height', pi.height
        ) ORDER BY pi.position) FILTER (WHERE pi.id IS NOT NULL) as images,
        json_agg(jsonb_build_object(
          'id', pv.id,
          'title', pv.title,
          'price', jsonb_build_object(
            'amount', pv.price_amount::text,
            'currencyCode', pv.price_currency
          ),
          'availableForSale', pv.available_for_sale,
          'selectedOptions', (
            SELECT json_agg(jsonb_build_object(
              'name', pvo.name,
              'value', pvo.value
            ))
            FROM product_variant_options pvo
            WHERE pvo.variant_id = pv.id
          )
        )) FILTER (WHERE pv.id IS NOT NULL) as variants
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.handle = $1
      GROUP BY p.id
    `, [handle]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const row = result.rows[0];
    const product = {
      id: row.id,
      handle: row.handle,
      title: row.title,
      description: row.description,
      descriptionHtml: `<p>${row.description}</p>`,
      availableForSale: row.available_for_sale,
      priceRange: {
        maxVariantPrice: {
          amount: row.price_amount.toString(),
          currencyCode: row.price_currency
        },
        minVariantPrice: {
          amount: row.price_amount.toString(),
          currencyCode: row.price_currency
        }
      },
      featuredImage: {
        url: row.featured_image_url,
        altText: row.featured_image_alt,
        width: 800,
        height: 800
      },
      images: row.images || [],
      variants: row.variants || [],
      seo: {
        title: row.seo_title || row.title,
        description: row.seo_description || row.description
      },
      tags: [],
      updatedAt: row.updated_at
    };

    res.json({ product });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product recommendations
exports.getProductRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    // Get products from same collections
    const result = await pool.query(`
      SELECT p.*,
        json_agg(jsonb_build_object(
          'url', pi.url,
          'altText', pi.alt_text,
          'width', pi.width,
          'height', pi.height
        )) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id IN (
        SELECT DISTINCT p2.id
        FROM products p2
        JOIN product_collections pc2 ON p2.id = pc2.product_id
        WHERE pc2.collection_id IN (
          SELECT collection_id 
          FROM product_collections 
          WHERE product_id = $1
        )
        AND p2.id != $1
      )
      AND p.available_for_sale = true
      GROUP BY p.id
      LIMIT 4
    `, [id]);

    const products = result.rows.map(row => ({
      id: row.id,
      handle: row.handle,
      title: row.title,
      priceRange: {
        maxVariantPrice: {
          amount: row.price_amount.toString(),
          currencyCode: row.price_currency
        }
      },
      featuredImage: row.images && row.images[0] ? row.images[0] : {
        url: row.featured_image_url,
        altText: row.featured_image_alt,
        width: 800,
        height: 800
      }
    }));

    res.json({ products });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
