@echo off
echo ========================================
echo  KHỞI ĐỘNG BACKEND API
echo ========================================
cd backend
start "Backend API" cmd /k "npm run dev"

timeout /t 3

echo.
echo ========================================
echo  KHỞI ĐỘNG FRONTEND
echo ========================================
cd ..\commerce
start "Frontend Next.js" cmd /k "pnpm dev"

echo.
echo ✅ Đã khởi động:
echo    - Backend:  http://localhost:3001
echo    - Frontend: http://localhost:3000
echo.
pause
