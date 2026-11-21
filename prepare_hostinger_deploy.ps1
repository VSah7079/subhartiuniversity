$ProgressPreference = 'SilentlyContinue'

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "📦 Packaging SVSU ERP Portal for Hostinger Production..." -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan

# 1. Build Client
Write-Host "[1/3] Building Production Client Assets..." -ForegroundColor Yellow
npm --prefix client run build

# 2. Prepare Deploy Directory
$DeployDir = "hostinger_deploy"
if (Test-Path $DeployDir) {
    Remove-Item -Recurse -Force $DeployDir
}
New-Item -ItemType Directory -Path $DeployDir | Out-Null

Write-Host "[2/3] Copying Production Files..." -ForegroundColor Yellow

# Copy root entry files
Copy-Item "index.js" -Destination $DeployDir
Copy-Item "server.js" -Destination $DeployDir
Copy-Item "package.json" -Destination $DeployDir
Copy-Item ".htaccess" -Destination $DeployDir
Copy-Item "ecosystem.config.js" -Destination $DeployDir
Copy-Item ".env.production.example" -Destination (Join-Path $DeployDir ".env")

# Copy server without node_modules
New-Item -ItemType Directory -Path (Join-Path $DeployDir "server") | Out-Null
Copy-Item -Recurse "server/config" (Join-Path $DeployDir "server/config")
Copy-Item -Recurse "server/controllers" (Join-Path $DeployDir "server/controllers")
Copy-Item -Recurse "server/middleware" (Join-Path $DeployDir "server/middleware")
Copy-Item -Recurse "server/models" (Join-Path $DeployDir "server/models")
Copy-Item -Recurse "server/routes" (Join-Path $DeployDir "server/routes")
Copy-Item "server/server.js" (Join-Path $DeployDir "server/server.js")
Copy-Item "server/seed.js" (Join-Path $DeployDir "server/seed.js")
Copy-Item "server/package.json" (Join-Path $DeployDir "server/package.json")
Copy-Item "server/.env.production.example" (Join-Path $DeployDir "server/.env")

# Copy compiled frontend dist
New-Item -ItemType Directory -Path (Join-Path $DeployDir "client") | Out-Null
Copy-Item -Recurse "client/dist" (Join-Path $DeployDir "client/dist")
Copy-Item -Recurse "client/dist" (Join-Path $DeployDir "dist")

# 3. Create ZIP archive using .NET ZipFile
Write-Host "[3/3] Creating ZIP archive 'hostinger_deploy.zip'..." -ForegroundColor Yellow
$ZipFile = Join-Path (Get-Location) 'hostinger_deploy.zip'
if (Test-Path $ZipFile) {
    Remove-Item -Force $ZipFile
}
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path $DeployDir).Path, $ZipFile)

$ZipSize = (Get-Item $ZipFile).Length / 1024
$roundedSize = [Math]::Round($ZipSize, 1)
$msg = '   -> File: hostinger_deploy.zip (' + $roundedSize + ' KB)'
Write-Host '======================================================='
Write-Host 'SUCCESS: Hostinger deployment archive created:'
Write-Host $msg
Write-Host '   -> Folder: hostinger_deploy/'
Write-Host '======================================================='


