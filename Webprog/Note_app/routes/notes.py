from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from extensions import db
from models.models import Note, Category
from utils.helpers import search_notes

notes_bp = Blueprint('notes', __name__)

@notes_bp.route('/')
@notes_bp.route('/<int:category_id>')
def list_notes(category_id=None):
    search_query = request.args.get('search', '')
    
    if category_id:
        category = db.session.get(Category, category_id)
        if not category:
            return "Category not found", 404
        if search_query:
            notes = search_notes(search_query, category_id)
        else:
            notes = db.session.query(Note).filter_by(category_id=category_id).order_by(Note.updated_at.desc()).all()
    else:
        if search_query:
            notes = search_notes(search_query)
        else:
            notes = db.session.query(Note).order_by(Note.updated_at.desc()).all()
        category = None
    
    categories = db.session.query(Category).all()
    return render_template('notes_list.html', notes=notes, categories=categories, 
                         current_category=category, search_query=search_query)

@notes_bp.route('/new')
def new_note():
    categories = db.session.query(Category).all()
    return render_template('note_editor.html', note=None, categories=categories)

@notes_bp.route('/edit/<int:note_id>')
def edit_note(note_id):
    note = db.session.get(Note, note_id)
    if not note:
        return "Note not found", 404
    categories = db.session.query(Category).all()
    return render_template('note_editor.html', note=note, categories=categories)

@notes_bp.route('/save', methods=['POST'])
def save_note():
    note_id = request.form.get('note_id')
    title = request.form.get('title', 'Untitled Note')
    content = request.form.get('content', '')
    category_id = request.form.get('category_id', 1)
    
    if note_id:
        note = db.session.get(Note, int(note_id))
        if not note:
            return "Note not found", 404
        if not note.is_locked:
            note.title = title
            note.content = content
            note.category_id = category_id
    else:
        note = Note(title=title, content=content, category_id=category_id)
        db.session.add(note)
    
    db.session.commit()
    return redirect(url_for('notes.list_notes'))

@notes_bp.route('/delete/<int:note_id>', methods=['POST'])
def delete_note(note_id):
    note = db.session.get(Note, note_id)
    if not note:
        return "Note not found", 404
    if not note.is_locked:
        db.session.delete(note)
        db.session.commit()
    return redirect(url_for('notes.list_notes'))

@notes_bp.route('/api/<int:note_id>')
def get_note_api(note_id):
    note = db.session.get(Note, note_id)
    if not note:
        return jsonify({'error': 'Note not found'}), 404
    return jsonify(note.to_dict())