from models.models import Note
from extensions import db
from datetime import datetime

def search_notes(query, category_id=None):
    """Search notes by title or content"""
    search = f"%{query}%"
    if category_id:
        return db.session.query(Note).filter(
            Note.category_id == category_id,
            (Note.title.like(search) | Note.content.like(search))
        ).order_by(Note.updated_at.desc()).all()
    else:
        return db.session.query(Note).filter(
            Note.title.like(search) | Note.content.like(search)
        ).order_by(Note.updated_at.desc()).all()

def format_date(date):
    """Format datetime object to readable string"""
    if isinstance(date, str):
        date = datetime.fromisoformat(date)
    return date.strftime("%B %d, %Y at %I:%M %p")