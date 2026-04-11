@echo off
echo.
echo =============================================
echo   AYUSH Gateway - RAG Service Launcher
echo   100%% Local - No API Keys Required
echo =============================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python...
python --version || (echo Python not found! && pause && exit /b 1)

echo.
echo [2/3] Installing dependencies (if missing)...
pip install sentence-transformers chromadb flask flask-cors --quiet

echo.
echo [3/3] Starting RAG Service on http://localhost:5001
echo       (First start downloads ~90MB embedding model)
echo.
echo Press Ctrl+C to stop the service.
echo.

python rag_service.py
pause
