-- Khải Nguyên Pharma Database Backup
-- Generated: 2026-01-11T08:40:49.878Z
-- PostgreSQL Database Dump

-- Disable triggers and constraints temporarily
SET session_replication_role = 'replica';

-- Clear existing data
DELETE FROM product_collections;
DELETE FROM product_variant_options;
DELETE FROM product_variants;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM collections;
DELETE FROM pages;


-- Collections
INSERT INTO collections (id, handle, title, description, seo_title, seo_description, created_at, updated_at) VALUES ('c13d30e0-3722-470f-9f16-222e228f6d45', 'giam-dau-ha-sot', 'Thuốc Giảm Đau - Hạ Sốt', 'Các sản phẩm giảm đau và hạ sốt hiệu quả', NULL, NULL, '2026-01-11T08:30:51.211Z', '2026-01-11T08:30:51.211Z');
INSERT INTO collections (id, handle, title, description, seo_title, seo_description, created_at, updated_at) VALUES ('ad20832b-a4f1-4360-afc0-72f2b5011968', 'vitamin-bo-sung', 'Vitamin & Thực Phẩm Chức Năng', 'Bổ sung vitamin và dưỡng chất thiết yếu', NULL, NULL, '2026-01-11T08:30:51.211Z', '2026-01-11T08:30:51.211Z');
INSERT INTO collections (id, handle, title, description, seo_title, seo_description, created_at, updated_at) VALUES ('227b4551-65ea-49c6-ab2c-220f10973808', 'khang-sinh', 'Kháng Sinh', 'Thuốc kháng sinh điều trị nhiễm khuẩn', NULL, NULL, '2026-01-11T08:30:51.211Z', '2026-01-11T08:30:51.211Z');
INSERT INTO collections (id, handle, title, description, seo_title, seo_description, created_at, updated_at) VALUES ('d3d2dc0f-56bc-420b-8721-d5a6324a0c59', 'tieu-hoa', 'Tiêu Hóa', 'Hỗ trợ và điều trị tiêu hóa', NULL, NULL, '2026-01-11T08:30:51.211Z', '2026-01-11T08:30:51.211Z');

-- Products
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('a6db6325-7c95-4df3-a234-620a7eb92872', 'amvitacine-150', 'AMVITACINE 150', 'Thuốc kháng sinh điều trị nhiễm khuẩn', 85000.00, 'VND', true, 'http://localhost:3001/uploads/products/amvitacine-150/main.jpg', 'AMVITACINE 150', NULL, NULL, '2026-01-11T08:30:51.218Z', '2026-01-11T08:30:51.218Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('7c86defc-1653-41a5-a05d-78568946ce4e', 'amvitacine-300', 'AMVITACINE 300', 'Thuốc kháng sinh điều trị nhiễm khuẩn liều cao', 145000.00, 'VND', true, 'http://localhost:3001/uploads/products/amvitacine-300/main.jpg', 'AMVITACINE 300', NULL, NULL, '2026-01-11T08:30:51.223Z', '2026-01-11T08:30:51.223Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('b8b52a3f-35ae-4ec0-807e-2459657d1966', 'cepmaxlox-100', 'CEPMAXLOX 100', 'Kháng sinh cephalosporin thế hệ mới', 120000.00, 'VND', true, 'http://localhost:3001/uploads/products/cepmaxlox-100/main.jpg', 'CEPMAXLOX 100', NULL, NULL, '2026-01-11T08:30:51.226Z', '2026-01-11T08:30:51.226Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('6ee82d0e-76ba-489c-b4ff-fd2e9e7ab8bf', 'chobamin-agi', 'CHOGAMIN AGI', 'Hỗ trợ tiêu hóa, tăng cường hấp thu', 65000.00, 'VND', true, 'http://localhost:3001/uploads/products/chobamin-agi/main.png', 'CHOGAMIN AGI', NULL, NULL, '2026-01-11T08:30:51.229Z', '2026-01-11T08:30:51.229Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('d6872efd-023e-4573-9a10-2b42f23e3642', 'dau-nong-kwan-fi-hong', 'Dầu Nóng Kwan Fi Hồng', 'Dầu gió massage giảm đau nhức cơ', 45000.00, 'VND', true, 'http://localhost:3001/uploads/products/dau-nong-kwan-fi-hong/main.png', 'Dầu Nóng Kwan Fi Hồng', NULL, NULL, '2026-01-11T08:30:51.232Z', '2026-01-11T08:30:51.232Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('81a17359-95da-4da6-84b0-6ee028d46059', 'keyuni-150', 'KEYUNI 150', 'Dung dịch truyền tĩnh mạch Keyuni', 95000.00, 'VND', true, 'http://localhost:3001/uploads/products/keyuni-150/main.jpg', 'KEYUNI 150', NULL, NULL, '2026-01-11T08:30:51.234Z', '2026-01-11T08:30:51.234Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('dfc933cc-0f9c-48be-ae99-d7732467db52', 'keyuni-300', 'KEYUNI 300', 'Dung dịch truyền tĩnh mạch Keyuni 300ml', 155000.00, 'VND', true, 'http://localhost:3001/uploads/products/keyuni-300/main.jpg', 'KEYUNI 300', NULL, NULL, '2026-01-11T08:30:51.236Z', '2026-01-11T08:30:51.236Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('c579584c-b6ec-4b1e-b022-0ca5184a0dc9', 'kim-tien-thao-480', 'Kim Tiền Thảo 480', 'Thực phẩm chức năng hỗ trợ thận, tiết niệu', 180000.00, 'VND', true, 'http://localhost:3001/uploads/products/kim-tien-thao-480/main.png', 'Kim Tiền Thảo 480', NULL, NULL, '2026-01-11T08:30:51.239Z', '2026-01-11T08:30:51.239Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('64476ef1-6695-4e2d-bf6d-0121ec34dea2', 'odesol', 'ODESOL', 'Thuốc điều trị rối loạn tiêu hóa', 75000.00, 'VND', true, 'http://localhost:3001/uploads/products/odesol/main.png', 'ODESOL', NULL, NULL, '2026-01-11T08:30:51.240Z', '2026-01-11T08:30:51.240Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('b6570f5f-017f-4983-884a-950d000e813f', 'povidone-iodine-10-percent', 'Povidone Iodine 10%', 'Dung dịch sát khuẩn vết thương', 35000.00, 'VND', true, 'http://localhost:3001/uploads/products/povidone-iodine-10-percent/main.jpg', 'Povidone Iodine 10%', NULL, NULL, '2026-01-11T08:30:51.243Z', '2026-01-11T08:30:51.243Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('fe932f5f-df80-4d14-b05d-5d2ce3a4e17f', 'vien-uong-dep-da-white-master-gluta', 'Viên Uống Đẹp Da White Master Gluta', 'Viên uống trắng da, chống lão hóa', 320000.00, 'VND', true, 'http://localhost:3001/uploads/products/vien-uong-dep-da-white-master-gluta/main.png', 'Viên Uống Đẹp Da White Master Gluta', NULL, NULL, '2026-01-11T08:30:51.245Z', '2026-01-11T08:30:51.245Z');
INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('28882efe-7689-4096-a8ce-f6486da660d3', 'xuyen-tam-lien-agi', 'Xuyên Tâm Liên AGI', 'Viên nang hỗ trợ điều trị nhiễm khuẩn đường hô hấp', 55000.00, 'VND', true, 'http://localhost:3001/uploads/products/xuyen-tam-lien-agi/main.png', 'Xuyên Tâm Liên AGI', NULL, NULL, '2026-01-11T08:30:51.247Z', '2026-01-11T08:30:51.247Z');

-- Product Variants
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('ac03e62d-de47-4d76-afc4-7b5981d0c0b7', 'a6db6325-7c95-4df3-a234-620a7eb92872', 'Mặc định', 85000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('3b6c42bb-3331-4025-b5db-93b0376040a2', '7c86defc-1653-41a5-a05d-78568946ce4e', 'Mặc định', 145000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('47df8dc3-6989-49a1-9c9d-9ae6ba76a205', 'b8b52a3f-35ae-4ec0-807e-2459657d1966', 'Mặc định', 120000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('5df93393-4bb0-44a9-ad6e-864745e384c8', '6ee82d0e-76ba-489c-b4ff-fd2e9e7ab8bf', 'Mặc định', 65000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('d1ef2b52-4945-4d92-b316-b1ad09b8020b', 'd6872efd-023e-4573-9a10-2b42f23e3642', 'Mặc định', 45000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('4c283e4c-f8bf-43c0-b80c-596c0da7d778', '81a17359-95da-4da6-84b0-6ee028d46059', 'Mặc định', 95000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('77e2a158-99b4-47e4-a35d-63f29be1a17c', 'dfc933cc-0f9c-48be-ae99-d7732467db52', 'Mặc định', 155000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('1432556f-9821-4ef4-8ed3-58c3a84f759f', 'c579584c-b6ec-4b1e-b022-0ca5184a0dc9', 'Mặc định', 180000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('bec90022-6e11-4172-922d-8bf8d2b783cd', '64476ef1-6695-4e2d-bf6d-0121ec34dea2', 'Mặc định', 75000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('26a8304f-c2ac-453d-9dbe-8202abda456d', 'b6570f5f-017f-4983-884a-950d000e813f', 'Mặc định', 35000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('df8ac598-26db-4888-b20c-4e56a1f8b597', 'fe932f5f-df80-4d14-b05d-5d2ce3a4e17f', 'Mặc định', 320000.00, 'VND', true);
INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('b966dc2a-c11b-43b6-8e94-73c6f6415bc0', '28882efe-7689-4096-a8ce-f6486da660d3', 'Mặc định', 55000.00, 'VND', true);

-- Product Images
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('24', '28882efe-7689-4096-a8ce-f6486da660d3', 'http://localhost:3001/uploads/products/xuyen-tam-lien-agi/main.png', 'Xuyên Tâm Liên AGI image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('21', '64476ef1-6695-4e2d-bf6d-0121ec34dea2', 'http://localhost:3001/uploads/products/odesol/main.png', 'ODESOL image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('16', '6ee82d0e-76ba-489c-b4ff-fd2e9e7ab8bf', 'http://localhost:3001/uploads/products/chobamin-agi/main.png', 'CHOGAMIN AGI image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('14', '7c86defc-1653-41a5-a05d-78568946ce4e', 'http://localhost:3001/uploads/products/amvitacine-300/main.jpg', 'AMVITACINE 300 image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('18', '81a17359-95da-4da6-84b0-6ee028d46059', 'http://localhost:3001/uploads/products/keyuni-150/main.jpg', 'KEYUNI 150 image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('13', 'a6db6325-7c95-4df3-a234-620a7eb92872', 'http://localhost:3001/uploads/products/amvitacine-150/main.jpg', 'AMVITACINE 150 image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('22', 'b6570f5f-017f-4983-884a-950d000e813f', 'http://localhost:3001/uploads/products/povidone-iodine-10-percent/main.jpg', 'Povidone Iodine 10% image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('15', 'b8b52a3f-35ae-4ec0-807e-2459657d1966', 'http://localhost:3001/uploads/products/cepmaxlox-100/main.jpg', 'CEPMAXLOX 100 image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('20', 'c579584c-b6ec-4b1e-b022-0ca5184a0dc9', 'http://localhost:3001/uploads/products/kim-tien-thao-480/main.png', 'Kim Tiền Thảo 480 image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('17', 'd6872efd-023e-4573-9a10-2b42f23e3642', 'http://localhost:3001/uploads/products/dau-nong-kwan-fi-hong/main.png', 'Dầu Nóng Kwan Fi Hồng image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('19', 'dfc933cc-0f9c-48be-ae99-d7732467db52', 'http://localhost:3001/uploads/products/keyuni-300/main.jpg', 'KEYUNI 300 image', 800, 800, 0, CURRENT_TIMESTAMP);
INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('23', 'fe932f5f-df80-4d14-b05d-5d2ce3a4e17f', 'http://localhost:3001/uploads/products/vien-uong-dep-da-white-master-gluta/main.png', 'Viên Uống Đẹp Da White Master Gluta image', 800, 800, 0, CURRENT_TIMESTAMP);

-- Product Collections
INSERT INTO product_collections (product_id, collection_id) VALUES ('a6db6325-7c95-4df3-a234-620a7eb92872', '227b4551-65ea-49c6-ab2c-220f10973808');
INSERT INTO product_collections (product_id, collection_id) VALUES ('7c86defc-1653-41a5-a05d-78568946ce4e', '227b4551-65ea-49c6-ab2c-220f10973808');
INSERT INTO product_collections (product_id, collection_id) VALUES ('b8b52a3f-35ae-4ec0-807e-2459657d1966', '227b4551-65ea-49c6-ab2c-220f10973808');
INSERT INTO product_collections (product_id, collection_id) VALUES ('6ee82d0e-76ba-489c-b4ff-fd2e9e7ab8bf', 'd3d2dc0f-56bc-420b-8721-d5a6324a0c59');
INSERT INTO product_collections (product_id, collection_id) VALUES ('d6872efd-023e-4573-9a10-2b42f23e3642', 'c13d30e0-3722-470f-9f16-222e228f6d45');
INSERT INTO product_collections (product_id, collection_id) VALUES ('81a17359-95da-4da6-84b0-6ee028d46059', 'c13d30e0-3722-470f-9f16-222e228f6d45');
INSERT INTO product_collections (product_id, collection_id) VALUES ('dfc933cc-0f9c-48be-ae99-d7732467db52', 'c13d30e0-3722-470f-9f16-222e228f6d45');
INSERT INTO product_collections (product_id, collection_id) VALUES ('c579584c-b6ec-4b1e-b022-0ca5184a0dc9', 'ad20832b-a4f1-4360-afc0-72f2b5011968');
INSERT INTO product_collections (product_id, collection_id) VALUES ('64476ef1-6695-4e2d-bf6d-0121ec34dea2', 'd3d2dc0f-56bc-420b-8721-d5a6324a0c59');
INSERT INTO product_collections (product_id, collection_id) VALUES ('b6570f5f-017f-4983-884a-950d000e813f', 'c13d30e0-3722-470f-9f16-222e228f6d45');
INSERT INTO product_collections (product_id, collection_id) VALUES ('fe932f5f-df80-4d14-b05d-5d2ce3a4e17f', 'c13d30e0-3722-470f-9f16-222e228f6d45');
INSERT INTO product_collections (product_id, collection_id) VALUES ('28882efe-7689-4096-a8ce-f6486da660d3', 'c13d30e0-3722-470f-9f16-222e228f6d45');

-- Pages
INSERT INTO pages (id, title, handle, body, seo_title, seo_description, created_at, updated_at) VALUES ('a8555281-58e1-4459-bd19-0bc48da258c8', 'Về Chúng Tôi', 'about-us', '<h1>Khải Nguyên Pharma</h1><p>Chúng tôi là nhà phân phối dược phẩm uy tín hàng đầu Việt Nam.</p>', NULL, NULL, '2026-01-11T08:30:51.250Z', '2026-01-11T08:30:51.250Z');
INSERT INTO pages (id, title, handle, body, seo_title, seo_description, created_at, updated_at) VALUES ('4e27de9a-78ff-4886-8d47-97756c269fa1', 'Liên Hệ', 'contact', '<h1>Liên hệ với chúng tôi</h1><p>Email: contact@khainguyen.com</p><p>Hotline: 1900-xxxx</p>', NULL, NULL, '2026-01-11T08:30:51.250Z', '2026-01-11T08:30:51.250Z');

-- Re-enable triggers and constraints
SET session_replication_role = DEFAULT;
