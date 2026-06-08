@echo off
cd /d "%~dp0"
echo Starting DarkMatter preview at http://127.0.0.1:4173
echo Press Ctrl+C to stop.
python -m http.server 4173 --bind 127.0.0.1
pause
