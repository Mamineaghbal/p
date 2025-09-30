// DOM Elements
const titleScreen = document.getElementById('title-screen');
const mainMenu = document.getElementById('main-menu');
const startBtn = document.getElementById('start-btn');
const returnToTitle = document.getElementById('return-to-title');

// Category buttons
const categoryBtns = document.querySelectorAll('.category-btn');

// Submenu returns
const returnToMainCalculus = document.getElementById('return-to-main-calculus');
const returnToMainAlgebra = document.getElementById('return-to-main-algebra');
const returnToMainProbability = document.getElementById('return-to-main-probability');
const returnToMainTopology = document.getElementById('return-to-main-topology');

// Topic items
const topicItems = document.querySelectorAll('.topic-item');

// Back buttons
const backBtns = document.querySelectorAll('.back-btn');

// Navigation functions
function showScreen(screenId) {
    // Hide all screens
    titleScreen.style.display = 'none';
    mainMenu.style.display = 'none';
    document.getElementById('calculus-submenu').style.display = 'none';
    document.getElementById('algebra-submenu').style.display = 'none';
    document.getElementById('probability-submenu').style.display = 'none';
    document.getElementById('topology-submenu').style.display = 'none';
    
    // Hide all content pages
    document.querySelectorAll('.content-page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show requested screen
    if (screenId === 'title') {
        titleScreen.style.display = 'block';
    } else if (screenId === 'main') {
        mainMenu.style.display = 'block';
    } else if (screenId === 'calculus') {
        document.getElementById('calculus-submenu').style.display = 'block';
    } else if (screenId === 'algebra') {
        document.getElementById('algebra-submenu').style.display = 'block';
    } else if (screenId === 'probability') {
        document.getElementById('probability-submenu').style.display = 'block';
    } else if (screenId === 'topology') {
        document.getElementById('topology-submenu').style.display = 'block';
    } else {
        // It's a content page
        document.getElementById(screenId).style.display = 'block';
    }
}

// Event Listeners
startBtn.addEventListener('click', () => {
    showScreen('main');
});

returnToTitle.addEventListener('click', () => {
    showScreen('title');
});

// Category buttons
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        showScreen(category);
    });
});

// Submenu return buttons
returnToMainCalculus.addEventListener('click', () => {
    showScreen('main');
});

returnToMainAlgebra.addEventListener('click', () => {
    showScreen('main');
});

returnToMainProbability.addEventListener('click', () => {
    showScreen('main');
});

returnToMainTopology.addEventListener('click', () => {
    showScreen('main');
});

// Topic items
topicItems.forEach(item => {
    item.addEventListener('click', () => {
        const topic = item.getAttribute('data-topic');
        showScreen(topic);
    });
});

// Back buttons
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-back');
        showScreen(category);
    });
});

// Initialize with title screen
showScreen('title');



