from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session
from ..domain.entities import StudySession, ReviewLog
from ..infrastructure.database import get_session
from ..infrastructure.repositories import StudySessionRepository
from ..infrastructure.auth import get_current_user
from ..application.ai_service import AIService

router = APIRouter(prefix="/study", tags=["study"])

@router.get("/dashboard/stats")
async def get_dashboard_stats(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    print(f"DEBUG: get_dashboard_stats called with user_id = '{user_id}'")
    repo = StudySessionRepository(session)
    stats = repo.get_stats(user_id)
    chart_data = repo.get_time_series_stats(user_id)
    return {**stats, "chart_data": chart_data}

@router.get("/next-sessions", response_model=List[StudySession])
async def get_next_sessions(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    repo = StudySessionRepository(session)
    return repo.get_by_user(user_id)

@router.post("/review")
async def record_review(session_id: int, quality: int, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    repo = StudySessionRepository(session)
    study_session = repo.get_by_id(session_id)
    if not study_session or study_session.user_id != user_id:
        raise HTTPException(status_code=404, detail="Session not found")
    
    study_session.record_review(quality)
    repo.save(study_session)
    
    # Save log for stats
    log = ReviewLog(
        user_id=user_id,
        topic_id=study_session.topic_id,
        quality=quality
    )
    repo.save_log(log)
    
    return {"status": "success", "message": "Review recorded", "next_review": study_session.next_review}

from pydantic import BaseModel
from typing import Dict, Any

from ..domain.interfaces import IEventPublisher, IAiTutorService

class TelemetryEvent(BaseModel):
    event_name: str
    data: Dict[str, Any]

class ExplainRequest(BaseModel):
    question_text: str
    user_answer: str
    correct_answer: str

def get_event_publisher() -> IEventPublisher:
    # A ser substituído pela injeção da classe local implementada mais tarde
    raise NotImplementedError("IEventPublisher provider not configured.")

def get_ai_tutor() -> IAiTutorService:
    # A ser substituído pelo serviço Ollama local futuramente
    raise NotImplementedError("IAiTutorService provider not configured.")

@router.post("/telemetry")
async def record_telemetry(
    event: TelemetryEvent, 
    publisher: IEventPublisher = Depends(get_event_publisher)
):
    await publisher.publish(event.event_name, event.data)
    return {"status": "success"}

@router.post("/ai/explain")
async def explain_error(
    req: ExplainRequest, 
    ai_tutor: IAiTutorService = Depends(get_ai_tutor)
):
    explanation = await ai_tutor.generate_explanation(
        req.question_text, req.user_answer, req.correct_answer
    )
    return {"explanation": explanation}
