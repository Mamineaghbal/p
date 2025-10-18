from flask import Flask
from extensions import db
from config import Config
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Ensure instance folder exists
    try:
        os.makedirs(os.path.join(app.instance_path))
    except OSError:
        pass
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    from routes.ui import ui_bp
    from routes.notes import notes_bp
    from routes.categories import categories_bp
    
    app.register_blueprint(ui_bp)
    app.register_blueprint(notes_bp, url_prefix='/notes')
    app.register_blueprint(categories_bp, url_prefix='/categories')
    
    # Create database tables and add default data
    with app.app_context():
        # Import models here after app context is set up
        from models.models import Category, Note
        
        # Create all tables
        db.create_all()
        print("✓ Database tables created")
        
        # Check if categories table is empty and add defaults
        try:
            category_count = db.session.query(Category).count()
            
            if category_count == 0:
                default_categories = [
                    Category(name='All', color='#F89B4D'),
                    Category(name='Math', color='#4CAF50'),
                    Category(name='Ideas', color='#2196F3'),
                    Category(name='Other', color='#9E9E9E')
                ]
                for cat in default_categories:
                    db.session.add(cat)
                db.session.commit()
                print("✓ Default categories created")
            else:
                print(f"✓ Found {category_count} existing categories")
        except Exception as e:
            print(f"Warning: {e}")
            db.session.rollback()
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("=" * 50)
    print("📘 Notes App Starting...")
    print("🌐 Open your browser to: http://localhost:5000")
    print("=" * 50)
    app.run(debug=True)