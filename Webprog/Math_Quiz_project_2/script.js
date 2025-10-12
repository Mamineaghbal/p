// script.js
let state = {
  branch: null,
  subBranch: null,
  difficulty: 'normal',
  count: 10,
  questions: [],
  index: 0,
  score: 0,
  startTime: null,
  timer: null
};

const screens = {
  main: document.getElementById('main-menu'),
  branch: document.getElementById('branch-screen'),
  settings: document.getElementById('module-settings'),
  quiz: document.getElementById('quiz-screen'),
  results: document.getElementById('results-screen')
};

function show(screen) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[screen].classList.remove('hidden');
}

// Navigation
document.querySelectorAll('.branch-btn').forEach(btn =>
  btn.addEventListener('click', () => {
    state.branch = btn.dataset.branch;
    renderSubBranches();
    show('branch');
  })
);

document.getElementById('return-main').onclick = () => show('main');
document.getElementById('return-branch').onclick = () => show('branch');

// Settings
document.querySelectorAll('[data-difficulty]').forEach(btn =>
  btn.addEventListener('click', () => {
    state.difficulty = btn.dataset.difficulty;
    document.querySelectorAll('[data-difficulty]').forEach(b => b.style.opacity = '0.6');
    btn.style.opacity = '1';
  })
);

document.querySelectorAll('[data-count]').forEach(btn =>
  btn.addEventListener('click', () => {
    state.count = +btn.dataset.count;
    document.querySelectorAll('[data-count]').forEach(b => b.style.opacity = '0.6');
    btn.style.opacity = '1';
  })
);

// Start quiz
document.getElementById('start-quiz').onclick = () => {
  state.questions = getQuestionsForModule(state.subBranch, state.difficulty, state.count);
  if (state.questions.length === 0) {
    alert('No questions available.');
    return;
  }
  state.index = 0;
  state.score = 0;
  state.startTime = Date.now();
  startTimer();
  showQuestion();
  show('quiz');
};

// Quiz logic
function showQuestion() {
  const q = state.questions[state.index];
  document.getElementById('module-header').textContent = state.subBranch;
  document.getElementById('question-text').textContent = q.question;
  const answersGrid = document.querySelector('.answers-grid');
  answersGrid.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn answer-btn';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i + 1, q.correct);
    answersGrid.appendChild(btn);
  });
  updateScore();
}

function selectAnswer(selected, correct) {
  const buttons = document.querySelectorAll('.answer-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('correct', 'wrong');
  });

  const selectedBtn = buttons[selected - 1];
  if (selected === correct) {
    selectedBtn.classList.add('correct');
    state.score++;
  } else {
    selectedBtn.classList.add('wrong');
    buttons[correct - 1].classList.add('correct');
  }
  updateScore();
}

function updateScore() {
  document.getElementById('score').textContent = `${state.score}/${state.questions.length}`;
}

function startTimer() {
  clearInterval(state.timer);
  let sec = 0;
  state.timer = setInterval(() => {
    sec++;
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${m}:${s}`;
  }, 1000);
}

document.getElementById('next-question').onclick = () => {
  state.index++;
  if (state.index >= state.questions.length) finishQuiz();
  else showQuestion();
};

document.getElementById('exit-quiz').onclick = () => {
  clearInterval(state.timer);
  show('main');
};

// Results
function finishQuiz() {
  clearInterval(state.timer);
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');

  const accuracy = state.score / state.questions.length;
  let perf = 'Needs work';
  if (accuracy >= 0.9) perf = 'Excellent!';
  else if (accuracy >= 0.7) perf = 'Good job!';
  else if (accuracy >= 0.5) perf = 'Not bad!';

  document.getElementById('results-module').textContent = state.subBranch;
  document.getElementById('results-score').textContent = `${state.score}/${state.questions.length}`;
  document.getElementById('results-time').textContent = `${m}:${s}`;
  document.getElementById('results-performance').textContent = perf;

  show('results');
}

document.getElementById('restart-btn').onclick = () => show('main');

// Sub-branches
function renderSubBranches() {
  const data = mathBranches[state.branch];
  document.getElementById('branch-title').textContent = data.name;
  const container = document.querySelector('.sub-branches-container');
  container.innerHTML = '';
  data.subBranches.forEach(sub => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = sub.name;
    btn.onclick = () => {
      state.subBranch = sub.key;
      document.getElementById('module-title').textContent = sub.name;
      show('settings');
    };
    container.appendChild(btn);
  });
}

// Initialize
document.querySelectorAll('[data-difficulty="normal"]').forEach(b => b.style.opacity = '1');
document.querySelectorAll('[data-count="10"]').forEach(b => b.style.opacity = '1');