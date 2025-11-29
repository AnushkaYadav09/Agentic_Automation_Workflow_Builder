from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Agentic Workflow Automation Backend")

# CORS middleware for frontend
# Allows the frontend (running on different ports) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and create tables
try:
    from app.database import Base, engine
    from app import models  # Ensure models are registered with Base
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database initialization error: {e}")

# Import routers
try:
    from app.auth.routes import router as auth_router
    app.include_router(auth_router)
except Exception as e:
    print(f"Auth router error: {e}")

try:
    from app.users.routes import router as users_router
    app.include_router(users_router)
except Exception as e:
    print(f"Users router error: {e}")

try:
    from app.templates.routes import router as templates_router
    app.include_router(templates_router)
except Exception as e:
    print(f"Templates router error: {e}")

try:
    from app.workflow.routes import router as workflow_router
    app.include_router(workflow_router)
except Exception as e:
    print(f"Workflow router error: {e}")

@app.get("/")
def root():
    return {"message": "Agentic Workflow Automation API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
