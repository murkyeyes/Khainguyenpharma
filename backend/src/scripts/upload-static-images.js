/**
 * Script upload ảnh tĩnh (logo, banner, slideshow) lên Cloudinary
 * Chạy: node src/scripts/upload-static-images.js
 */
require('dotenv').config();
const cloudinary = require('../config/cloudinary');
const path = require('path');

const IMAGES = [
  {
    localPath: path.join(__dirname, '../../public/uploads/products/logo.png'),
    publicId: 'khainguyen-pharma/static/logo',
    label: 'Logo'
  },
  {
    localPath: path.join(__dirname, '../../public/uploads/products/khainguyenpharma_hero_banner.png'),
    publicId: 'khainguyen-pharma/static/hero_banner',
    label: 'Hero Banner'
  },
  {
    localPath: path.join(__dirname, '../../public/uploads/products/slideshow_1.jpg'),
    publicId: 'khainguyen-pharma/static/slideshow_1',
    label: 'Slideshow 1'
  }
];

async function main() {
  console.log('🚀 Uploading static images to Cloudinary...\n');

  for (const img of IMAGES) {
    try {
      const result = await cloudinary.uploader.upload(img.localPath, {
        public_id: img.publicId,
        overwrite: true,
        resource_type: 'image'
      });
      console.log(`✅ ${img.label}: ${result.secure_url}`);
    } catch (err) {
      console.error(`❌ ${img.label}: ${err.message}`);
    }
  }

  console.log('\n✅ Done! Copy the URLs above to update your code.');
}

main();
