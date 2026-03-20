# Khải Nguyên Pharma - Hướng Dẫn Cài Đặt

## Yêu Cầu Hệ Thống

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (hoặc npm)

## Cài Đặt Database

### Bước 1: Tạo Database

```bash
# Đăng nhập vào PostgreSQL
psql -U postgres

# Tạo database mới
CREATE DATABASE khainguyen_pharma;

# Thoát psql
\q
```

### Bước 2: Tạo Schema

```bash
cd backend
psql -U postgres -d khainguyen_pharma -f src/database/schema.sql
```

### Bước 3: Import Data

```bash
# Sử dụng file dump có sẵn
psql -U postgres -d khainguyen_pharma -f database_dump.sql

# HOẶC chạy seed script
node src/database/seed.js
```

## Cài Đặt Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Cập nhật thông tin database trong .env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=khainguyen_pharma
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3001

# Chạy server
npm start
```

Backend sẽ chạy tại: http://localhost:3001

## Cài Đặt Frontend

```bash
cd commerce

# Cài đặt dependencies với pnpm
pnpm install

# Tạo file .env.local
cp .env.example .env.local

# Cập nhật URL backend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Chạy development server
pnpm dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Upload Hình Ảnh Sản Phẩm

Sao chép thư mục `backend/public/uploads/products` từ project gốc vào project mới.

Hoặc tải từ link: [link_drive_or_storage]

Cấu trúc thư mục:
```
backend/public/uploads/products/
├── amvitacine-150/
│   └── main.jpg
├── amvitacine-300/
│   └── main.jpg
├── cepmaxlox-100/
│   └── main.jpg
├── chobamin-agi/
│   └── main.png
└── ...
```

## Kiểm Tra

1. Backend API: http://localhost:3001/api/products
2. Frontend: http://localhost:3000
3. Trang tìm kiếm: http://localhost:3000/search
4. Chi tiết sản phẩm: http://localhost:3000/product/amvitacine-150

## Scripts Hữu Ích

### Backend
```bash
npm start           # Chạy production
npm run dev         # Chạy development với nodemon
```

### Frontend
```bash
pnpm dev            # Development server
pnpm build          # Build production
pnpm start          # Chạy production build
```

### Database
```bash
# Export database
node src/database/export-db.js

# Re-seed database
node src/database/seed.js

# Reset database
psql -U postgres -d khainguyen_pharma -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -U postgres -d khainguyen_pharma -f src/database/schema.sql
node src/database/seed.js
```

## Xử Lý Sự Cố

### Backend không kết nối được database
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra thông tin trong file .env
- Kiểm tra password PostgreSQL

### Frontend không load được ảnh
- Kiểm tra backend đang chạy
- Kiểm tra thư mục `public/uploads/products` có đầy đủ ảnh
- Kiểm tra URL trong .env.local

### Port đã được sử dụng
```bash
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Tìm process đang dùng port 3001
netstat -ano | findstr :3001

# Kill process (thay PID bằng số process ID)
taskkill /PID <process_id> /F
```

## Support

Email: support@khainguyen.com
Hotline: 0779 085 855
