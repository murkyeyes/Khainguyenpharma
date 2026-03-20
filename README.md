# 🏥 Khai Nguyên Pharma - E-commerce Platform

Hệ thống E-commerce hoàn chỉnh với **Next.js Frontend** + **Node.js Backend API** + **PostgreSQL Database**

---

## 📋 YÊU CẦU HỆ THỐNG

- ✅ Node.js (v18 trở lên)
- ✅ PostgreSQL (v14 trở lên)
- ✅ pnpm (cho frontend)
- ✅ npm (cho backend)

---

## 🚀 BƯỚC 1: SETUP BACKEND API

### 1.1. Cài đặt PostgreSQL

**Tải và cài đặt PostgreSQL:**
- Download: https://www.postgresql.org/download/windows/
- Cài đặt và nhớ password cho user `postgres`

**Kiểm tra cài đặt:**
```powershell
psql --version
```

### 1.2. Tạo Database

**Mở PowerShell và chạy:**
```powershell
# Kết nối PostgreSQL (nhập password khi được hỏi)
psql -U postgres

# Tạo database
CREATE DATABASE khainguyen_pharma;

# Kiểm tra
\l

# Thoát
\q
```

### 1.3. Cấu hình Backend

**Di chuyển vào thư mục backend:**
```powershell
cd d:\khainguyenpharma\backend
```

**Tạo file .env từ .env.example:**
```powershell
Copy-Item .env.example .env
```

**Mở file `.env` và sửa thông tin:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=khainguyen_pharma
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE

PORT=3001
NODE_ENV=development

API_SECRET=my-random-secret-key-xyz-123
FRONTEND_URL=http://localhost:3000
```

⚠️ **LƯU Ý:** Thay `YOUR_POSTGRES_PASSWORD_HERE` bằng password PostgreSQL của bạn!

### 1.4. Cài đặt Dependencies

```powershell
npm install
```

### 1.5. Chạy Migration (Tạo Tables)

```powershell
npm run migrate
```

**Kết quả mong đợi:**
```
✅ Migrations completed successfully!
```

### 1.6. Thêm Data Mẫu

```powershell
npm run seed
```

**Kết quả mong đợi:**
```
✅ Seeding completed successfully!
📦 Created:
   - 3 products
   - 2 collections
   - 2 pages
   - 6 menu items
```

### 1.7. Chạy Backend Server

```powershell
npm run dev
```

**Kết quả mong đợi:**
```
🚀 Server running on http://localhost:3001
✅ Connected to PostgreSQL database
```

**Kiểm tra Backend:**
- Mở browser: http://localhost:3001/health
- Nếu thấy `{"status":"OK","timestamp":"..."}` → Backend OK! ✅

**⚠️ GIỮ TERMINAL NÀY CHẠY! Mở terminal mới để chạy frontend.**

---

## 🎨 BƯỚC 2: SETUP FRONTEND (Next.js)

### 2.1. Mở Terminal Mới

Bấm `Ctrl + Shift + ~` trong VS Code hoặc mở PowerShell mới

### 2.2. Di chuyển vào thư mục frontend

```powershell
cd d:\khainguyenpharma\commerce
```

### 2.3. Tạo file .env

```powershell
Copy-Item .env.example .env
```

**File `.env` đã có sẵn nội dung:**
```env
COMPANY_NAME="CÔNG TY TNHH DƯỢC PHẨM - THIẾT BỊ Y TẾ KHẢI NGUYÊN"
SITE_NAME="khainguyenpharma"

# URL của Backend API
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Secret key tự tạo
API_REVALIDATION_SECRET="your-random-secret-key-here"
```

### 2.4. Cài đặt pnpm (nếu chưa có)

```powershell
npm install -g pnpm
```

### 2.5. Cài đặt Dependencies

```powershell
pnpm install
```

### 2.6. Chạy Frontend

```powershell
pnpm dev
```

**Kết quả mong đợi:**
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in 2.3s
```

**Mở browser:** http://localhost:3000

✅ **Bạn sẽ thấy trang web E-commerce với:**
- Danh sách sản phẩm
- Menu navigation
- Chức năng tìm kiếm
- Giỏ hàng

---

## 🎯 KIỂM TRA HỆ THỐNG

### Backend API Endpoints

Mở browser hoặc Postman để test:

| Endpoint | Mô tả |
|----------|-------|
| http://localhost:3001/health | Health check |
| http://localhost:3001/api/products | Danh sách sản phẩm |
| http://localhost:3001/api/collections | Danh mục sản phẩm |
| http://localhost:3001/api/pages | Các trang |
| http://localhost:3001/api/menu/main-menu | Menu navigation |

### Frontend Pages

| URL | Trang |
|-----|-------|
| http://localhost:3000 | Trang chủ |
| http://localhost:3000/search | Tìm kiếm sản phẩm |
| http://localhost:3000/product/paracetamol-500mg | Chi tiết sản phẩm |
| http://localhost:3000/search/giam-dau-ha-sot | Danh mục sản phẩm |

---

## 📝 CÁC LỆNH HỮU ÍCH

### Backend Commands

```powershell
cd d:\khainguyenpharma\backend

npm run dev       # Chạy development server
npm run start     # Chạy production server
npm run migrate   # Chạy database migrations
npm run seed      # Thêm data mẫu
npm run clear     # Xóa tất cả data
```

### Frontend Commands

```powershell
cd d:\khainguyenpharma\commerce

pnpm dev          # Chạy development server
pnpm build        # Build production
pnpm start        # Chạy production server
pnpm prettier     # Format code
```

---

## 🔧 TROUBLESHOOTING

### Lỗi: Password authentication failed

**Nguyên nhân:** Password PostgreSQL trong `.env` không đúng

**Giải pháp:**
1. Mở file `backend/.env`
2. Sửa `DB_PASSWORD` cho đúng với password PostgreSQL của bạn

### Lỗi: Port already in use

**Backend (port 3001):**
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3001

# Kill process (thay PID bằng số process)
taskkill /PID <PID_NUMBER> /F
```

**Frontend (port 3000):**
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID_NUMBER> /F
```

### Lỗi: Connection refused khi Frontend gọi Backend

**Kiểm tra:**
1. Backend có đang chạy không? → `http://localhost:3001/health`
2. File `commerce/.env` có đúng `NEXT_PUBLIC_API_URL="http://localhost:3001"` không?

### Lỗi: Database connection failed

**Kiểm tra PostgreSQL đang chạy:**
```powershell
Get-Service postgresql*

# Nếu stopped, khởi động
Start-Service postgresql-x64-16  # (thay số version của bạn)
```

### Lỗi: Module not found

**Backend:**
```powershell
cd backend
rm -r node_modules
npm install
```

**Frontend:**
```powershell
cd commerce
rm -r node_modules
pnpm install
```

---

## 🗂️ CẤU TRÚC PROJECT

```
khainguyenpharma/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database config
│   │   │   └── database.js
│   │   ├── controllers/       # Business logic
│   │   │   ├── productController.js
│   │   │   ├── collectionController.js
│   │   │   ├── cartController.js
│   │   │   ├── pageController.js
│   │   │   └── menuController.js
│   │   ├── routes/            # API routes
│   │   │   ├── products.js
│   │   │   ├── collections.js
│   │   │   ├── cart.js
│   │   │   ├── pages.js
│   │   │   └── menu.js
│   │   ├── database/          # Migrations & seeds
│   │   │   ├── migrate.js
│   │   │   ├── seed.js
│   │   │   └── clear.js
│   │   └── server.js          # Entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── commerce/                   # Next.js Frontend
    ├── app/                    # App Router pages
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── [page]/            # Dynamic pages
    │   ├── product/           # Product pages
    │   ├── search/            # Search & collections
    │   └── api/               # API routes
    ├── components/             # React components
    │   ├── cart/
    │   ├── layout/
    │   ├── product/
    │   └── grid/
    ├── lib/
    │   ├── api/               # API adapter (thay thế Shopify)
    │   │   ├── index.ts
    │   │   └── types.ts
    │   └── constants.ts
    ├── package.json
    └── .env.example
```

---

## 📊 DATABASE SCHEMA

### Tables

- **products** - Sản phẩm
- **product_images** - Hình ảnh sản phẩm
- **product_variants** - Biến thể sản phẩm
- **product_variant_options** - Options của variants
- **collections** - Danh mục sản phẩm
- **product_collections** - Liên kết sản phẩm với danh mục
- **carts** - Giỏ hàng
- **cart_items** - Sản phẩm trong giỏ
- **pages** - Các trang nội dung
- **menus** - Menu navigation

---

## 🔄 RESET DATABASE

**Nếu muốn reset toàn bộ database:**

```powershell
cd d:\khainguyenpharma\backend

# Cách 1: Xóa và seed lại
npm run clear
npm run seed

# Cách 2: Drop và tạo lại từ đầu
npm run migrate
npm run seed
```

---

## 🚢 DEPLOY PRODUCTION

### Backend (Node.js API)

**Hosting options:**
- Vercel
- Railway
- Render
- Heroku

**Environment variables cần set:**
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `PORT`, `NODE_ENV=production`
- `API_SECRET`
- `FRONTEND_URL`

### Frontend (Next.js)

**Deploy lên Vercel:**
```powershell
cd commerce
vercel deploy
```

**Environment variables:**
- `COMPANY_NAME`
- `SITE_NAME`
- `NEXT_PUBLIC_API_URL` (URL của backend production)
- `API_REVALIDATION_SECRET`

### Database

**PostgreSQL hosting options:**
- Supabase (free tier)
- Neon (free tier)
- Railway
- AWS RDS

---

## 📚 TECH STACK

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Headless UI

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL client)

**Tools:**
- pnpm (frontend package manager)
- npm (backend package manager)
- nodemon (development)

---

## 🆘 HỖ TRỢ

### Debug Mode

**Backend:**
```powershell
$env:NODE_ENV="development"
npm run dev
```

**Frontend:**
```powershell
pnpm dev
```

### Xem Logs

- **Backend logs:** Terminal đang chạy `npm run dev`
- **Frontend logs:** Terminal đang chạy `pnpm dev`
- **PostgreSQL logs:** Xem trong pgAdmin hoặc log files

### Liên Hệ

Nếu gặp vấn đề, check:
1. ✅ PostgreSQL đang chạy?
2. ✅ Backend server đang chạy ở port 3001?
3. ✅ File `.env` đã cấu hình đúng?
4. ✅ Database đã migrate và seed?

---

## ✅ CHECKLIST KHI CHẠY LẦN ĐẦU

- [ ] Đã cài PostgreSQL
- [ ] Đã tạo database `khainguyen_pharma`
- [ ] Đã tạo file `backend/.env` với password đúng
- [ ] Đã chạy `npm install` trong thư mục backend
- [ ] Đã chạy `npm run migrate`
- [ ] Đã chạy `npm run seed`
- [ ] Backend server đang chạy tại port 3001
- [ ] Đã tạo file `commerce/.env`
- [ ] Đã cài pnpm
- [ ] Đã chạy `pnpm install` trong thư mục commerce
- [ ] Frontend đang chạy tại port 3000
- [ ] Có thể mở http://localhost:3000 và thấy website

---

**🎉 Chúc bạn thành công!**

Nếu mọi thứ hoạt động, bạn sẽ có một hệ thống E-commerce hoàn chỉnh với:
- ✅ Backend REST API
- ✅ Frontend Next.js
- ✅ PostgreSQL Database
- ✅ Quản lý sản phẩm, danh mục, giỏ hàng
- ✅ Tìm kiếm và filter
- ✅ Responsive design
