import os
import sys
from sqlmodel import Session
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.infrastructure.database import engine
from src.infrastructure.repositories import StudySessionRepository

def debug_stats():
    with Session(engine) as session:
        repo = StudySessionRepository(session)
        stats = repo.get_stats("1")
        print("Stats for user 1:", stats)

if __name__ == "__main__":
    debug_stats()
