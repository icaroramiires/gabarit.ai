from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import SQLModel, Field

class StudySession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    topic_id: str
    
    # SRS Metadata
    interval: int = Field(default=1)  # Days
    ease_factor: float = Field(default=2.5)
    repetitions: int = Field(default=0)
    
    last_reviewed: datetime = Field(default_factory=datetime.utcnow)
    next_review: datetime = Field(default_factory=datetime.utcnow)

    def record_review(self, quality: int):
        """
        Updates the SRS metadata based on the review quality (0-5).
        Simplified SM-2 implementation.
        """
        if quality >= 3:
            if self.repetitions == 0:
                self.interval = 1
            elif self.repetitions == 1:
                self.interval = 6
            else:
                self.interval = round(self.interval * self.ease_factor)
            
            self.repetitions += 1
        else:
            self.repetitions = 0
            self.interval = 1
            
        self.ease_factor = self.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        if self.ease_factor < 1.3:
            self.ease_factor = 1.3
            
        self.last_reviewed = datetime.utcnow()
        self.next_review = self.last_reviewed + timedelta(days=self.interval)

class ReviewLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    topic_id: str
    quality: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    duration_minutes: int = Field(default=15) # Placeholder default duration
