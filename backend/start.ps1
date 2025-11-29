# Activate virtual environment and start FastAPI server
& "$PSScriptRoot\venv\Scripts\Activate.ps1"
Write-Host "Starting FastAPI server..." -ForegroundColor Green
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
