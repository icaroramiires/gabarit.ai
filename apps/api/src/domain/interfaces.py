from abc import ABC, abstractmethod
from typing import Dict, Any

class IEventPublisher(ABC):
    """
    Interface (Port) for publishing telemetry events.
    Implementation should handle the delivery of the event (e.g., Local Queue, GCP Pub/Sub).
    """
    @abstractmethod
    async def publish(self, event_name: str, payload: Dict[str, Any]) -> None:
        pass


class IAiTutorService(ABC):
    """
    Interface (Port) for generating pedagogical explanations.
    Implementation should handle communication with LLMs (e.g., Ollama, Google Vertex AI).
    """
    @abstractmethod
    async def generate_explanation(self, question_text: str, user_answer: str, correct_answer: str) -> str:
        pass
