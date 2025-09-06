@echo off
setlocal enabledelayedexpansion

rem ===================================
rem 自动化部署脚本 - Wenkang Zhang's Blog
rem ===================================

echo.
echo ================================
echo   Wenkang Zhang's Blog Deploy
echo ================================
echo.

cd /d "c:\Users\86151\Desktop\Mr-Zwkid.github.io"
echo 当前目录: %CD%
echo.

rem 检查Python是否可用
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Python未安装或不在PATH中
    echo 请安装Python并确保添加到系统PATH
    pause
    exit /b 1
)

echo [1/5] 生成HTML文件...
python build.py
if errorlevel 1 (
    echo 错误: HTML生成失败
    pause
    exit /b 1
)

echo.
echo [2/5] 检查Git状态...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo 错误: 当前目录不是Git仓库
    pause
    exit /b 1
)

git status

echo.
echo [3/5] 添加所有更改...
git add .

echo.
echo [4/5] 提交更改...
set /p commit_msg="请输入提交信息 (直接回车使用默认信息): "
if "!commit_msg!"=="" set commit_msg=Auto-generate HTML files and update content - %date% %time%
git commit -m "!commit_msg!"

echo.
echo [5/5] 推送到GitHub...
git push origin main
if errorlevel 1 (
    echo 错误: 推送失败，请检查网络连接和Git配置
    pause
    exit /b 1
)

echo.
echo ================================
echo      部署完成！
echo ================================
echo 你的更改现在应该已经在GitHub Pages上线了
echo 访问: https://mr-zwkid.github.io/
echo.
pause
