from fastapi import FastAPI
from src.presentation.api import router as study_router

from fastapi.middleware.cors import CORSMiddleware

from src.presentation.api import get_event_publisher, get_ai_tutor
from src.infrastructure.telemetry.local_publisher import LocalEventPublisher
from src.infrastructure.ai.ollama_tutor import OllamaTutorService

app = FastAPI(title="Gabarit.ai API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(study_router, prefix="/api")

# --- Dependency Injection Setup (Ports and Adapters) ---

# Singleton instances for local adapters (in production we would inject GCP Pub/Sub and Vertex AI)
publisher_adapter = LocalEventPublisher()
tutor_adapter = OllamaTutorService(model="qwen2.5:latest")

app.dependency_overrides[get_event_publisher] = lambda: publisher_adapter
app.dependency_overrides[get_ai_tutor] = lambda: tutor_adapter

@app.get("/")
async def root():
    return {"message": "Welcome to Gabarit.ai API"}
