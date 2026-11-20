@echo off
title Packaging for Hostinger Deployment - SVSU ERP
echo =======================================================
echo Packaging SVSU ERP Portal for Hostinger Production...
echo =======================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0prepare_hostinger_deploy.ps1"

pause
