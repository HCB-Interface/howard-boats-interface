@echo off
REM One-click deploy: stages, commits, and pushes to GitHub Pages.
REM Double-click this file to publish the latest local changes.

cd /d "%~dp0"

echo.
echo === Howard Boats Interface — deploy ===
echo.

git status --short
echo.

set /p msg="Commit message (press Enter for 'update'): "
if "%msg%"=="" set msg=update

git add -A
git commit -m "%msg%"
if %errorlevel% neq 0 (
  echo.
  echo Nothing to commit, or commit failed. See the message above.
  pause
  exit /b %errorlevel%
)

git push
if %errorlevel% neq 0 (
  echo.
  echo Push failed. Check your internet connection and GitHub credentials.
  pause
  exit /b %errorlevel%
)

echo.
echo === Deployed. Live URL will refresh in about 30 seconds: ===
echo https://hcb-interface.github.io/howard-boats-interface/
echo.
pause
