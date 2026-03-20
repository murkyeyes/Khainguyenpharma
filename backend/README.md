# Khai Nguyen Pharma - Backend API

Backend REST API cho hệ thống E-commerce Khai Nguyen Pharma.

## Công Nghệ Sử Dụng
- **Node.js** + **Express.js**
- **PostgreSQL**
- **REST API**

## Cài Đặt

### 1. Install Dependencies
```bash
npm install
```
ádasdasdasd
### 2. Cấu Hình Database
Tạo file `.env` từ `.env.example` và điền thông tin PostgreSQL của bạn:
```bash
copy .env.example .env
```

### 3. Tạo Database
```sql
CREATE DATABASE khainguyen_pharma;
```

### 4. Chạy Migration
```bash
npm run migrate
```

### 5. Seed Data (Optional)
```bash
npm run seed
```

### 6. Chạy Server
```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:3001

## API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:handle` - Lấy chi tiết sản phẩm
- `GET /api/products/:id/recommendations` - Sản phẩm gợi ý

### Collections
- `GET /api/collections` - Lấy danh sách danh mục
- `GET /api/collections/:handle` - Lấy chi tiết danh mục
- `GET /api/collections/:id/products` - Sản phẩm trong danh mục

### Cart
- `POST /api/cart` - Tạo giỏ hàng mới
- `GET /api/cart/:id` - Lấy thông tin giỏ hàng
- `POST /api/cart/:id/items` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/:id/items` - Cập nhật giỏ hàng
- `DELETE /api/cart/:id/items/:lineId` - Xóa sản phẩm khỏi giỏ

### Pages
- `GET /api/pages` - Lấy danh sách trang
- `GET /api/pages/:handle` - Lấy chi tiết trang

### Menu
- `GET /api/menu/:handle` - Lấy menu navigation
