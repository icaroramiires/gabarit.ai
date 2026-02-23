import logging
from typing import Dict, Any
from ...domain.interfaces import IEventPublisher

logger = logging.getLogger("telemetry")
logger.setLevel(logging.INFO)

# In-memory store just to simulate a queue or log
class LocalEventPublisher(IEventPublisher):
    def __init__(self):
        self.events = []

    async def publish(self, event_name: str, payload: Dict[str, Any]) -> None:
        event = {"event_name": event_name, "payload": payload}
        self.events.append(event)
        
        # Simulate publishing to a message broker
        logger.info(f"🚀 [Local Pub/Sub Simulate] Delivered Event: {event_name} | Payload: {payload}")
        print(f"🚀 [Local Pub/Sub Simulate] Delivered Event: {event_name} | Payload: {payload}")
