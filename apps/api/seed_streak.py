import os
import sys
from datetime import datetime, timedelta
from sqlmodel import Session, create_engine
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.domain.entities import ReviewLog, StudySession
from src.infrastructure.database import engine

def seed_data():
    with Session(engine) as session:
        user_id = "1"
        
        # We need a dummy study session first
        study_session = StudySession(user_id=user_id, topic_id="math_01")
        session.add(study_session)
        session.commit()
        session.refresh(study_session)

        print(f"✅ Created dummy session: {study_session.id}")

        # Let's create a 5-day streak ending today
        today = datetime.utcnow()
        for i in range(5):
            days_ago = today - timedelta(days=i)
            log = ReviewLog(
                user_id=user_id,
                topic_id="math_01",
                quality=5 if i % 2 == 0 else 3,
                timestamp=days_ago,
                duration_minutes=20
            )
            session.add(log)
            print(f"📝 Added Log for: {days_ago.strftime('%Y-%m-%d')} | Quality: {log.quality}")
        
        # Let's create a broken streak 10 days ago
        for i in range(10, 12):
            days_ago = today - timedelta(days=i)
            log = ReviewLog(
                user_id=user_id,
                topic_id="math_01",
                quality=4,
                timestamp=days_ago,
                duration_minutes=15
            )
            session.add(log)
            print(f"📝 Added Older Log for: {days_ago.strftime('%Y-%m-%d')} | Quality: {log.quality}")
            
        session.commit()
        print("🎉 Seed completo para test@example.com! O streak deve ser 5 no dashboard.")

if __name__ == "__main__":
    seed_data()
