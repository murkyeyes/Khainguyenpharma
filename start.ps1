# Khởi động Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " KHỞI ĐỘNG BACKEND API" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\khainguyenpharma\backend; npm run dev"

Start-Sleep -Seconds 3

# Khởi động Frontend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " KHỞI ĐỘNG FRONTEND" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\khainguyenpharma\commerce; pnpm dev"

Write-Host ""
Write-Host "✅ Đã khởi động:" -ForegroundColor Green
Write-Host "   - Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Nhấn phím bất kỳ để thoát..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
