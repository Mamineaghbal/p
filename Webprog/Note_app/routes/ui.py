from flask import Blueprint, render_template, redirect, url_for

ui_bp = Blueprint('ui', __name__)

@ui_bp.route('/')
def start():
    return render_template('start.html')

@ui_bp.route('/main')
def main():
    return redirect(url_for('notes.list_notes'))