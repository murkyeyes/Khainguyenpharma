const pool = require('../config/database');

// Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM collections
      ORDER BY title ASC
    `);

    const collections = result.rows.map(row => ({
      handle: row.handle,
      title: row.title,
      description: row.description,
      seo: {
        title: row.seo_title || row.title,
        description: row.seo_description || row.description
      },
      updatedAt: row.updated_at,
      path: `/search/${row.handle}`
    }));

    res.json({ collections });
  } catch (error) {
    console.error('Error getting collections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single collection by handle
exports.getCollectionByHandle = async (req, res) => {
  try {
    const { handle } = req.params;

    const result = await pool.query(`
      SELECT * FROM collections
      WHERE handle = $1
    `, [handle]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const row = result.rows[0];
    const collection = {
      id: row.id,
      handle: row.handle,
      title: row.title,
      description: row.description,
      seo: {
        title: row.seo_title || row.title,
        description: row.seo_description || row.description
      },
      updatedAt: row.updated_at
    };

    res.json({ collection });
  } catch (error) {
    console.error('Error getting collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get products in a collection
exports.getCollectionProducts = async (req, res) => {
  try {
    const { handle } = req.params;
    const { sortKey = 'CREATED_AT', reverse = 'false' } = req.query;

    const result = await pool.query(`
      SELECT 
        p.*,
        json_agg(DISTINCT jsonb_build_object(
          'url', pi.url,
          'altText', pi.alt_text,
          'width', pi.width,
          'height', pi.height
        )) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id IN (
        SELECT product_id 
        FROM product_collections pc
        JOIN collections c ON pc.collection_id = c.id
        WHERE c.handle = $1
      )
      GROUP BY p.id
      ORDER BY p.created_at ${reverse === 'true' ? 'DESC' : 'ASC'}
    `, [handle]);

    const products = result.rows.map(row => ({
      id: row.id,
      handle: row.handle,
      title: row.title,
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
      }
    }));

    res.json({ products });
  } catch (error) {
    console.error('Error getting collection products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
