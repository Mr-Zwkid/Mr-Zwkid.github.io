@echo off
cd /d "c:\Users\86151\Desktop\Mr-Zwkid.github.io"
echo Current directory:
cd
echo.
echo Generating HTML files from Markdown...
python build.py
echo.
echo Checking git status...
git status
echo.
echo Adding all changes...
git add .
echo.
echo Committing changes...
git commit -m "Auto-generate HTML files and update content"
echo.
echo Pushing to GitHub...
git push origin main
echo.
echo Done! Your changes should now be live on GitHub Pages.
echo Check: https://mr-zwkid.github.io/blog.html
pause
