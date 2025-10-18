from flask import Blueprint, render_template, request, redirect, url_for, jsonify, flash
from extensions import db
from models.models import Category

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/')
def list_categories():
    categories = db.session.query(Category).all()
    return render_template('categories.html', categories=categories)

@categories_bp.route('/new', methods=['POST'])
def new_category():
    name = request.form.get('name')
    color = request.form.get('color', '#F89B4D')
    
    if name:
        # Check if category already exists
        existing = db.session.query(Category).filter_by(name=name).first()
        if not existing:
            category = Category(name=name, color=color)
            db.session.add(category)
            db.session.commit()
    
    return redirect(url_for('categories.list_categories'))

@categories_bp.route('/edit', methods=['POST'])
def edit_category():
    category_id = request.form.get('category_id')
    name = request.form.get('name')
    color = request.form.get('color', '#F89B4D')
    
    if category_id and name:
        category = db.session.get(Category, int(category_id))
        if category and category.name != 'All':  # Don't allow editing "All" category
            category.name = name
            category.color = color
            db.session.commit()
    
    return redirect(url_for('categories.list_categories'))

@categories_bp.route('/delete/<int:category_id>', methods=['POST'])
def delete_category(category_id):
    category = db.session.get(Category, category_id)
    
    if category and category.name != 'All':  # Don't allow deleting "All" category
        # This will also delete all notes in this category due to cascade
        db.session.delete(category)
        db.session.commit()
    
    return redirect(url_for('categories.list_categories'))

@categories_bp.route('/api/all')
def get_categories_api():
    categories = db.session.query(Category).all()
    return jsonify([cat.to_dict() for cat in categories])