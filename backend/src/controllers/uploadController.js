const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const pool = require('../config/database');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      const handle = req.params.handle || req.body.handle;
      return `khainguyen-pharma/products/${handle}`;
    },
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
    public_id: (req, file) => {
      const imageType = req.body.imageType || 'main'; // main, detail-1, detail-2, etc
      return imageType; // Cloudinary will auto-append format, so this is just the base name
    }
  }
});

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const contentImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Upload image for product rich content
exports.uploadProductContentImage = [
  contentImageUpload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Không có ảnh upload' });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'khainguyen-pharma/products/content',
            public_id: `content-${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      res.json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error('Upload product content image error:', error);
      res.status(500).json({ error: 'Lỗi upload ảnh nội dung sản phẩm' });
    }
  }
];

// Upload product image endpoint
exports.uploadProductImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Không có file được upload' });
      }

      const { handle } = req.params;
      const { altText, imageType = 'main' } = req.body;

      // Check if product exists
      const productResult = await pool.query(
        'SELECT id FROM products WHERE handle = $1',
        [handle]
      );

      if (productResult.rows.length === 0) {
        // Delete uploaded file if product doesn't exist
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
      }

      const productId = productResult.rows[0].id;
      // Cloudinary returning URL in req.file.path
      const imageUrl = req.file.path; 

      // Insert or update image record in database
      const existingImage = await pool.query(
        'SELECT id FROM product_images WHERE product_id = $1 AND url LIKE $2',
        [productId, `%${imageType}%`]
      );

      if (existingImage.rows.length > 0) {
        // Update existing image
        await pool.query(
          'UPDATE product_images SET url = $1, alt_text = $2 WHERE id = $3',
          [imageUrl, altText || `${imageType} image`, existingImage.rows[0].id]
        );
      } else {
        // Insert new image
        await pool.query(
          `INSERT INTO product_images (product_id, url, alt_text, width, height)
           VALUES ($1, $2, $3, $4, $5)`,
          [productId, imageUrl, altText || `${imageType} image`, 800, 800]
        );
      }

      // Nếu upload ảnh 'main', cập nhật luôn featured_image_url trên bảng products
      if (imageType === 'main') {
        await pool.query(
          'UPDATE products SET featured_image_url = $1, featured_image_alt = $2 WHERE id = $3',
          [imageUrl, altText || handle, productId]
        );
      }

      res.json({
        message: 'Upload ảnh thành công',
        image: {
          url: imageUrl,
          altText: altText || `${imageType} image`,
          filename: req.file.filename, // Keep public_id if want to delete later
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Upload image error:', error);
      
      // Clean up uploaded file on error
      if (req.file && req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      
      res.status(500).json({ 
        error: 'Lỗi upload ảnh',
        details: error.message,
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      });
    }
  }
];

// Delete product image
exports.deleteProductImage = async (req, res) => {
  try {
    const { handle, filename } = req.params;

    // Check if product exists
    const productResult = await pool.query(
      'SELECT id FROM products WHERE handle = $1',
      [handle]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    const productId = productResult.rows[0].id;

    // The filename might need to be constructed the way Cloudinary identifies your file, which is usually its public_id.
    // Assuming `filename` from frontend is actually like `khainguyen-pharma/products/<handle>/<filename_part>`
    // Wait, let's reconstruct public_id based on folder + filename part:
    const publicId = `khainguyen-pharma/products/${handle}/${filename}`;

    // Delete from database
    await pool.query(
      'DELETE FROM product_images WHERE product_id = $1 AND url LIKE $2',
      [productId, `%${filename}%`]
    );

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.json({ message: 'Xóa ảnh thành công' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Lỗi xóa ảnh' });
  }
};

// Get all images for a product
exports.getProductImages = async (req, res) => {
  try {
    const { handle } = req.params;

    const result = await pool.query(
      `SELECT pi.* 
       FROM product_images pi
       JOIN products p ON pi.product_id = p.id
       WHERE p.handle = $1
       ORDER BY pi.created_at`,
      [handle]
    );

    res.json({ images: result.rows });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách ảnh' });
  }
};
