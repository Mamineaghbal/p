📘 Notes App
A lightweight personal note-taking and organization web application with category-based note management and journaling-style editing.
🚀 Features

Start Screen: Simple landing page with fade-in animation
Notes Management: Create, edit, delete, and organize notes
Category System: Filter notes by categories (Math, Ideas, Other, etc.)
Search Functionality: Search notes by title or content
Note Editor: Full-featured editor with save/undo/exit controls
Lock Notes: Mark notes as read-only
Responsive Design: Works on desktop, tablet, and mobile devices
Keyboard Shortcuts:

Ctrl/Cmd + S - Save note
Ctrl/Cmd + N - New note
Ctrl/Cmd + F - Search
Escape - Close modals



🛠️ Technology Stack

Backend: Flask (Python)
Database: SQLite3 with Flask-SQLAlchemy
Frontend: HTML (Jinja2 templates), CSS, JavaScript
Architecture: Model-View-Template (MVT)

📦 Installation
Prerequisites

Python 3.8 or higher
pip (Python package manager)

Setup Steps

Clone or download the project
Navigate to the project directory

bash   cd note_app

Create a virtual environment (recommended)

bash   python -m venv venv

Activate the virtual environment

On Windows:



bash     venv\Scripts\activate

On macOS/Linux:

bash     source venv/bin/activate

Install dependencies

bash   pip install -r requirements.txt

Run the application

bash   python app.py

Open your browser

Navigate to: http://localhost:5000



📁 Project Structure
note_app/
│
├── app.py                        # Main Flask application
├── config.py                     # Configuration settings
├── requirements.txt              # Dependencies
├── README.md                     # Documentation
│
├── instance/
│   └── notes_app.db             # SQLite database (auto-generated)
│
├── static/
│   ├── css/
│   │   ├── style.css            # Main visual style
│   │   └── theme.css            # Color definitions
│   ├── js/
│   │   └── main.js              # JavaScript functionality
│   └── img/
│       └── icons/               # UI icons (optional)
│
├── templates/
│   ├── base.html                # Base template
│   ├── start.html               # Start screen
│   ├── notes_list.html          # Notes list view
│   ├── note_editor.html         # Note editor
│   └── categories.html          # Category management
│
├── models/
│   ├── __init__.py
│   └── models.py                # Database schema
│
├── routes/
│   ├── __init__.py
│   ├── notes.py                 # Note CRUD routes
│   ├── categories.py            # Category routes
│   └── ui.py                    # UI routes
│
└── utils/
    ├── __init__.py
    └── helpers.py               # Helper functions
🎨 Color Scheme

Base Background: #F8EEC7 (Light Beige)
Panel Background: #FFD89D (Warm Orange)
Primary Border: #F89B4D (Orange)
Save Button: #43A047 (Green)
Exit/Delete Button: #E53935 (Red)
Search Button: #2196F3 (Blue)
Text: #2E2E2E (Dark Gray)

📊 Database Schema
Categories Table
FieldTypeDescriptionidINTEGERPrimary KeynameTEXTCategory namecolorTEXTCategory color
Notes Table
FieldTypeDescriptionidINTEGERPrimary KeytitleTEXTNote titlecontentTEXTNote bodycategory_idINTEGERForeign Keyis_lockedBOOLEANRead-only flagcreated_atDATETIMECreation timestampupdated_atDATETIMELast modified time
🔧 API Routes
UI Routes

GET / - Start screen
GET /main - Redirect to notes list

Note Routes

GET /notes - List all notes
GET /notes/<category_id> - List notes by category
GET /notes/new - Create new note form
GET /notes/edit/<note_id> - Edit note form
POST /notes/save - Save note
POST /notes/delete/<note_id> - Delete note
GET /notes/api/<note_id> - Get note JSON

Category Routes

GET /categories - List all categories
POST /categories/new - Create new category
GET /categories/api/all - Get categories JSON

🎯 Usage Guide
Creating a Note

Click "New Note" button
Enter a title
Select a category
Write your content
Click "Save" and confirm

Editing a Note

Click on any note in the list
Make your changes
Click "Save" to update or "Exit" to cancel
Use "Undo" to revert to last saved version

Managing Categories

Click on the category dropdown
Select "Manage Categories"
View all categories and note counts
Click "New Category" to add a new one

Searching Notes

Click the "Search" button
Enter your search query
Press "Search" to filter results
Click "✕" to clear search

🔒 Security Notes

Change the SECRET_KEY in production
Use environment variables for sensitive data
Consider adding user authentication for multi-user scenarios

🐛 Troubleshooting
Database not creating

Ensure the instance/ directory exists
Check file permissions
Run python app.py to auto-create tables

Port already in use

Change the port in app.py:

python  app.run(debug=True, port=5001)
CSS/JS not loading

Clear browser cache
Check that static files are in correct directories
Verify Flask is serving static files correctly

🚀 Future Enhancements

 User authentication and multiple user support
 Rich text editor with formatting
 File attachments
 Export notes to PDF/Markdown
 Dark mode theme
 Mobile app version
 Cloud sync capabilities
 Tags and advanced filtering
 Note sharing functionality
 Backup and restore features

📝 License
This project is open source and available for educational purposes.
👨‍💻 Development
To contribute or modify:

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request

🙏 Acknowledgments
Built as a learning project to demonstrate:

Flask application structure
SQLAlchemy ORM usage
RESTful routing
Template inheritance
CSS theming
JavaScript interactivity

📧 Support
For issues or questions, please check the troubleshooting section or create an issue in the project repository.

Happy Note-Taking! 📝✨