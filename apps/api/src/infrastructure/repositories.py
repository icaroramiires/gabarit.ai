from typing import List, Optional, Dict
from sqlmodel import Session, select, func
from ..domain.entities import StudySession, ReviewLog
from datetime import datetime, timedelta

class StudySessionRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, session: StudySession) -> StudySession:
        self.session.add(session)
        self.session.commit()
        self.session.refresh(session)
        return session

    def save_log(self, log: ReviewLog) -> ReviewLog:
        self.session.add(log)
        self.session.commit()
        self.session.refresh(log)
        return log

    def get_by_user(self, user_id: str) -> List[StudySession]:
        statement = select(StudySession).where(StudySession.user_id == user_id)
        return self.session.exec(statement).all()

    def get_by_id(self, session_id: int) -> Optional[StudySession]:
        return self.session.get(StudySession, session_id)

    def get_stats(self, user_id: str):
        # Calculate total hours (total duration_minutes / 60)
        hours_statement = select(func.sum(ReviewLog.duration_minutes)).where(ReviewLog.user_id == user_id)
        total_minutes = self.session.exec(hours_statement).one() or 0
        total_hours = total_minutes / 60.0

        # Calculate accuracy (quality >= 4 / total)
        total_statement = select(func.count(ReviewLog.id)).where(ReviewLog.user_id == user_id)
        total_reviews = self.session.exec(total_statement).one() or 0
        
        hits_statement = select(func.count(ReviewLog.id)).where(ReviewLog.user_id == user_id, ReviewLog.quality >= 4)
        hits = self.session.exec(hits_statement).one() or 0
        
        accuracy = (hits / total_reviews * 100.0) if total_reviews > 0 else 0.0

        # Calculate Streak (consecutive days of study)
        streak_statement = select(ReviewLog.timestamp).where(ReviewLog.user_id == user_id).order_by(ReviewLog.timestamp.desc())
        all_timestamps = self.session.exec(streak_statement).all()
        
        unique_dates = sorted(list(set([t.date() for t in all_timestamps])), reverse=True)
        streak = 0
        
        if unique_dates:
            today = datetime.utcnow().date()
            # Se a última vez que estudou foi hoje ou ontem, conta a ofensiva. Se for mais antigo, quebra (0).
            if unique_dates[0] == today or unique_dates[0] == today - timedelta(days=1):
                streak = 1
                current_date = unique_dates[0]
                
                # Checa os dias anteriores sequencialmente
                for i in range(1, len(unique_dates)):
                    if unique_dates[i] == current_date - timedelta(days=1):
                        streak += 1
                        current_date = unique_dates[i]
                    else:
                        break

        return {
            "total_hours": round(float(total_hours), 1),
            "accuracy_rate": round(float(accuracy), 1),
            "streak": streak,
            "position": 124 # Placeholder sustentável
        }

    def get_time_series_stats(self, user_id: str, days: int = 30):
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # This is a bit complex for SQLite in one query without raw SQL
        # We'll fetch logs and group in Python for simplicity in this demo
        statement = select(ReviewLog).where(
            ReviewLog.user_id == user_id,
            ReviewLog.timestamp >= start_date
        ).order_by(ReviewLog.timestamp)
        
        logs = self.session.exec(statement).all()
        
        daily_data = {}
        for log in logs:
            date_str = log.timestamp.strftime("%Y-%m-%d")
            if date_str not in daily_data:
                daily_data[date_str] = {"hits": 0, "total": 0, "minutes": 0}
            
            daily_data[date_str]["total"] += 1
            daily_data[date_str]["minutes"] += log.duration_minutes
            if log.quality >= 4:
                daily_data[date_str]["hits"] += 1
        
        # Transform to list of dicts for frontend
        result = []
        for i in range(days):
            d = (start_date + timedelta(days=i+1)).strftime("%Y-%m-%d")
            stats = daily_data.get(d, {"hits": 0, "total": 0, "minutes": 0})
            accuracy = (stats["hits"] / stats["total"] * 100) if stats["total"] > 0 else 0
            
            result.append({
                "date": d,
                "accuracy": round(accuracy, 1),
                "hours": round(stats["minutes"] / 60.0, 1)
            })
            
        return result
