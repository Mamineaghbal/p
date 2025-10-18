// Main JavaScript for Notes App

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Notes App Loaded');
    initializeApp();
});

function initializeApp() {
    // Add smooth transitions
    document.body.classList.add('loaded');
    
    // Auto-focus on search input when search bar is visible
    const searchInput = document.querySelector('.search-input');
    if (searchInput && searchInput.offsetParent !== null) {
        searchInput.focus();
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#43A047' : type === 'error' ? '#E53935' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save (in editor)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn) {
            saveBtn.click();
        }
    }
    
    // Ctrl/Cmd + N for new note
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const newBtn = document.querySelector('.btn-new');
        if (newBtn) {
            window.location.href = newBtn.href;
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchBtn = document.querySelector('.btn-search');
        if (searchBtn) {
            searchBtn.click();
            setTimeout(() => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }
});

// Auto-save functionality (optional enhancement)
let autoSaveTimer;
function enableAutoSave() {
    const contentTextarea = document.getElementById('content');
    const titleInput = document.getElementById('title');
    
    if (!contentTextarea || !titleInput) return;
    
    function triggerAutoSave() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            console.log('Auto-saving...');
            // Could implement actual auto-save here
        }, 2000);
    }
    
    contentTextarea.addEventListener('input', triggerAutoSave);
    titleInput.addEventListener('input', triggerAutoSave);
}

// Call auto-save on editor pages
if (document.querySelector('.editor-screen')) {
    enableAutoSave();
}

// Confirmation before leaving page with unsaved changes
window.addEventListener('beforeunload', function(e) {
    const editorScreen = document.querySelector('.editor-screen');
    if (editorScreen && typeof hasChanges !== 'undefined' && hasChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Enhanced search with highlighting
function highlightSearchResults(query) {
    if (!query) return;
    
    const noteItems = document.querySelectorAll('.note-item .note-title');
    noteItems.forEach(item => {
        const text = item.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedText = text.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
        item.innerHTML = highlightedText;
    });
}

// Call highlight if there's a search query
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');
if (searchQuery) {
    highlightSearchResults(searchQuery);
}

console.log('Notes App JavaScript initialized successfully!');