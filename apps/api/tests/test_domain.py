from datetime import datetime, timedelta
from src.domain.entities import StudySession

def test_spaced_repetition_logic_success():
    session = StudySession(user_id="user1", topic_id="math")
    initial_next_review = session.next_review
    
    # Simulate a successful review (quality 5)
    session.record_review(quality=5)
    
    assert session.repetitions == 1
    assert session.interval == 1
    assert session.next_review > initial_next_review
    assert session.next_review.date() == (datetime.utcnow() + timedelta(days=1)).date()

def test_spaced_repetition_logic_failure():
    session = StudySession(user_id="user1", topic_id="math")
    session.repetitions = 2
    session.interval = 6
    
    # Simulate a failure review (quality 0)
    session.record_review(quality=0)
    
    assert session.repetitions == 0
    assert session.interval == 1
