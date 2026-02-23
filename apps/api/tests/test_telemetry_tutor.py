import pytest
from fastapi.testclient import TestClient
from typing import Dict, Any

from main import app
from src.domain.interfaces import IEventPublisher, IAiTutorService
from src.presentation.api import get_event_publisher, get_ai_tutor

# Mocks for our Interfaces
class MockEventPublisher(IEventPublisher):
    def __init__(self):
        self.published_events = []

    async def publish(self, event_name: str, payload: Dict[str, Any]) -> None:
        self.published_events.append({"event_name": event_name, "payload": payload})


class MockAiTutorService(IAiTutorService):
    async def generate_explanation(self, question_text: str, user_answer: str, correct_answer: str) -> str:
        return f"Mock explanation for {question_text}. You chose {user_answer} but the answer is {correct_answer}."


# Mock API dependencies
mock_publisher = MockEventPublisher()
mock_tutor = MockAiTutorService()

def override_publisher():
    return mock_publisher

def override_tutor():
    return mock_tutor

app.dependency_overrides[get_event_publisher] = override_publisher
app.dependency_overrides[get_ai_tutor] = override_tutor

client = TestClient(app)


def test_telemetry_endpoint():
    # Make sure we hit the telemetry endpoint
    payload = {
        "event_name": "STUDY_SESSION_STARTED",
        "data": {
            "topic_id": "math_01",
            "duration": 0
        }
    }
    
    response = client.post("/api/study/telemetry", json=payload)
    
    # Assert
    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_ai_tutor_explanation():
    # Make sure we hit the ai tutor endpoint
    payload = {
        "question_text": "What is the capital of France?",
        "user_answer": "London",
        "correct_answer": "Paris"
    }

    response = client.post("/api/study/ai/explain", json=payload)
    
    # Assert
    assert response.status_code == 200
    assert "Mock explanation" in response.json()["explanation"]
    assert "Paris" in response.json()["explanation"]
