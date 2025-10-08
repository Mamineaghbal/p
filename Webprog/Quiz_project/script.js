// Global variables
let currentDifficulty = '';
let questionCount = 20;
let currentQuestionIndex = 0;
let score = 0;
let timer = 0;
let timerInterval;
let availableQuestions = []; // Questions available for current quiz session
let userAnswers = [];

// DOM elements
const difficultyPage = document.getElementById('difficulty-page');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const countButtons = document.querySelectorAll('.count-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

// Diverse Easy Questions (50 unique questions)
// Easy Math Questions (Below High School)
const easyQuestions = [
    { question: "What is 2 + 2?", options: ['3', '4', '5', '6'], correctAnswer: 1 },
    { question: "What color is the sky on a clear day?", options: ['Green', 'Blue', 'Red', 'Yellow'], correctAnswer: 1 },
    { question: "How many legs does a cat have?", options: ['2', '3', '4', '6'], correctAnswer: 2 },
    { question: "What is the first letter of the alphabet?", options: ['B', 'C', 'A', 'Z'], correctAnswer: 2 },
    { question: "What do you drink when you are thirsty?", options: ['Food', 'Water', 'Air', 'Light'], correctAnswer: 1 },
    { question: "How many days are in a week?", options: ['5', '6', '7', '8'], correctAnswer: 2 },
    { question: "What is 5 + 3?", options: ['7', '8', '9', '10'], correctAnswer: 1 },
    { question: "What season comes after winter?", options: ['Summer', 'Autumn', 'Spring', 'Fall'], correctAnswer: 2 },
    { question: "What do you use to write on paper?", options: ['Fork', 'Pen', 'Shoe', 'Book'], correctAnswer: 1 },
    { question: "How many fingers do you have on one hand?", options: ['4', '5', '6', '10'], correctAnswer: 1 },
    { question: "What is the opposite of hot?", options: ['Cold', 'Warm', 'Cool', 'Freezing'], correctAnswer: 0 },
    { question: "What do you call a baby dog?", options: ['Kitten', 'Puppy', 'Cub', 'Calf'], correctAnswer: 1 },
    { question: "What is 10 - 4?", options: ['5', '6', '7', '8'], correctAnswer: 1 },
    { question: "Where do fish live?", options: ['Trees', 'Desert', 'Water', 'Mountains'], correctAnswer: 2 },
    { question: "What is the color of a banana?", options: ['Red', 'Blue', 'Yellow', 'Green'], correctAnswer: 2 },
    { question: "How many wheels does a bicycle have?", options: ['1', '2', '3', '4'], correctAnswer: 1 },
    { question: "What do you wear on your feet?", options: ['Hat', 'Gloves', 'Shoes', 'Scarf'], correctAnswer: 2 },
    { question: "What is 3 × 2?", options: ['5', '6', '7', '8'], correctAnswer: 1 },
    { question: "What is the capital of the United States?", options: ['New York', 'Los Angeles', 'Washington D.C.', 'Chicago'], correctAnswer: 2 },
    { question: "What do bees make?", options: ['Milk', 'Honey', 'Bread', 'Cheese'], correctAnswer: 1 },
    { question: "How many months are in a year?", options: ['10', '11', '12', '13'], correctAnswer: 2 },
    { question: "What is the largest planet in our solar system?", options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 2 },
    { question: "What do you use to cut paper?", options: ['Hammer', 'Scissors', 'Spoon', 'Pencil'], correctAnswer: 1 },
    { question: "What is 8 ÷ 2?", options: ['2', '3', '4', '5'], correctAnswer: 2 },
    { question: "What is the main ingredient in bread?", options: ['Sugar', 'Flour', 'Salt', 'Water'], correctAnswer: 1 },
    { question: "How many eyes do humans have?", options: ['1', '2', '3', '4'], correctAnswer: 1 },
    { question: "What is the fastest land animal?", options: ['Lion', 'Cheetah', 'Horse', 'Elephant'], correctAnswer: 1 },
    { question: "What do you call a group of lions?", options: ['Herd', 'Pack', 'Pride', 'Flock'], correctAnswer: 2 },
    { question: "What is 7 + 8?", options: ['14', '15', '16', '17'], correctAnswer: 1 },
    { question: "What is the tallest animal?", options: ['Elephant', 'Giraffe', 'Horse', 'Kangaroo'], correctAnswer: 1 },
    { question: "What do plants need to grow?", options: ['Music', 'Sunlight', 'Television', 'Cars'], correctAnswer: 1 },
    { question: "How many sides does a triangle have?", options: ['2', '3', '4', '5'], correctAnswer: 1 },
    { question: "What is the freezing point of water in Celsius?", options: ['-10', '0', '10', '100'], correctAnswer: 1 },
    { question: "What is the chemical symbol for gold?", options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 2 },
    { question: "What is 12 - 7?", options: ['4', '5', '6', '7'], correctAnswer: 1 },
    { question: "What is the largest ocean?", options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 3 },
    { question: "How many continents are there?", options: ['5', '6', '7', '8'], correctAnswer: 2 },
    { question: "What is the currency of Japan?", options: ['Dollar', 'Euro', 'Yen', 'Pound'], correctAnswer: 2 },
    { question: "What is 4 × 5?", options: ['15', '20', '25', '30'], correctAnswer: 1 },
    { question: "What is the smallest planet in our solar system?", options: ['Mars', 'Venus', 'Mercury', 'Earth'], correctAnswer: 2 },
    { question: "What do you call a baby cow?", options: ['Puppy', 'Kitten', 'Calf', 'Foal'], correctAnswer: 2 },
    { question: "How many hours are in a day?", options: ['20', '22', '24', '26'], correctAnswer: 2 },
    { question: "What is the boiling point of water in Celsius?", options: ['90', '100', '110', '120'], correctAnswer: 1 },
    { question: "What is the capital of Canada?", options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], correctAnswer: 2 },
    { question: "What is 9 + 6?", options: ['14', '15', '16', '17'], correctAnswer: 1 },
    { question: "What is the main gas in Earth's atmosphere?", options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], correctAnswer: 2 },
    { question: "How many players are on a soccer team?", options: ['9', '10', '11', '12'], correctAnswer: 2 },
    { question: "What is the largest mammal?", options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], correctAnswer: 1 },
    { question: "What is 15 ÷ 3?", options: ['3', '4', '5', '6'], correctAnswer: 2 },
    { question: "What is the capital of Australia?", options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctAnswer: 2 },
    { question: "How many bones are in the human body?", options: ['200', '206', '212', '220'], correctAnswer: 1 }
];

// Diverse Normal Questions (50 unique questions)
const normalQuestions = [
    { question: "What is the capital of France?", options: ['London', 'Berlin', 'Paris', 'Rome'], correctAnswer: 2 },
    { question: "Which planet is known as the Red Planet?", options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1 },
    { question: "What is the largest desert in the world?", options: ['Gobi', 'Sahara', 'Antarctic', 'Arabian'], correctAnswer: 2 },
    { question: "Who painted the Mona Lisa?", options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'], correctAnswer: 2 },
    { question: "What is the chemical formula for water?", options: ['CO2', 'H2O', 'NaCl', 'O2'], correctAnswer: 1 },
    { question: "Which element has the chemical symbol 'O'?", options: ['Gold', 'Oxygen', 'Osmium', 'Oganesson'], correctAnswer: 1 },
    { question: "What is the longest river in the world?", options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctAnswer: 1 },
    { question: "In which year did World War II end?", options: ['1943', '1944', '1945', '1946'], correctAnswer: 2 },
    { question: "What is the square root of 144?", options: ['10', '11', '12', '13'], correctAnswer: 2 },
    { question: "Which country is known as the Land of the Rising Sun?", options: ['China', 'Korea', 'Japan', 'Thailand'], correctAnswer: 2 },
    { question: "What is the largest organ in the human body?", options: ['Heart', 'Liver', 'Skin', 'Brain'], correctAnswer: 2 },
    { question: "Which gas do plants absorb from the atmosphere?", options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 2 },
    { question: "What is the capital of Brazil?", options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correctAnswer: 2 },
    { question: "How many bones are in the adult human body?", options: ['200', '206', '212', '220'], correctAnswer: 1 },
    { question: "What is the hardest natural substance on Earth?", options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correctAnswer: 2 },
    { question: "Which planet has the most moons?", options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correctAnswer: 1 },
    { question: "What is the currency of the United Kingdom?", options: ['Euro', 'Dollar', 'Pound Sterling', 'Franc'], correctAnswer: 2 },
    { question: "Who wrote 'Romeo and Juliet'?", options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctAnswer: 1 },
    { question: "What is the speed of light in vacuum?", options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], correctAnswer: 0 },
    { question: "Which ocean is the smallest?", options: ['Atlantic', 'Indian', 'Arctic', 'Southern'], correctAnswer: 2 },
    { question: "What is the atomic number of carbon?", options: ['6', '8', '12', '14'], correctAnswer: 0 },
    { question: "Which country has the largest population?", options: ['India', 'United States', 'China', 'Indonesia'], correctAnswer: 2 },
    { question: "What is the main component of natural gas?", options: ['Propane', 'Butane', 'Methane', 'Ethane'], correctAnswer: 2 },
    { question: "Which vitamin is produced when skin is exposed to sunlight?", options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], correctAnswer: 3 },
    { question: "What is the capital of Egypt?", options: ['Alexandria', 'Giza', 'Cairo', 'Luxor'], correctAnswer: 2 },
    { question: "How many teeth does an adult human have?", options: ['28', '30', '32', '34'], correctAnswer: 2 },
    { question: "Which metal is liquid at room temperature?", options: ['Iron', 'Mercury', 'Gold', 'Silver'], correctAnswer: 1 },
    { question: "What is the largest internal organ in the human body?", options: ['Heart', 'Liver', 'Brain', 'Lungs'], correctAnswer: 1 },
    { question: "Which country invented tea?", options: ['India', 'England', 'China', 'Japan'], correctAnswer: 2 },
    { question: "What is the pH value of pure water?", options: ['5', '6', '7', '8'], correctAnswer: 2 },
    { question: "Which planet is closest to the Sun?", options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 2 },
    { question: "What is the capital of South Africa?", options: ['Johannesburg', 'Cape Town', 'Pretoria', 'Durban'], correctAnswer: 2 },
    { question: "How many chambers does the human heart have?", options: ['2', '3', '4', '5'], correctAnswer: 2 },
    { question: "Which gas makes up about 78% of Earth's atmosphere?", options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correctAnswer: 2 },
    { question: "What is the largest bird in the world?", options: ['Eagle', 'Condor', 'Ostrich', 'Albatross'], correctAnswer: 2 },
    { question: "Which element is represented by the symbol 'Fe'?", options: ['Fluorine', 'Francium', 'Fermium', 'Iron'], correctAnswer: 3 },
    { question: "What is the capital of Mexico?", options: ['Guadalajara', 'Monterrey', 'Mexico City', 'Puebla'], correctAnswer: 2 },
    { question: "How many pairs of chromosomes do humans have?", options: ['22', '23', '24', '25'], correctAnswer: 1 },
    { question: "Which planet has rings?", options: ['Mars', 'Jupiter', 'Saturn', 'Uranus'], correctAnswer: 2 },
    { question: "What is the largest island in the world?", options: ['Greenland', 'New Guinea', 'Borneo', 'Madagascar'], correctAnswer: 0 },
    { question: "Which country is the largest by area?", options: ['China', 'United States', 'Canada', 'Russia'], correctAnswer: 3 },
    { question: "What is the chemical symbol for silver?", options: ['Si', 'S', 'Ag', 'Au'], correctAnswer: 2 },
    { question: "Which organ produces insulin?", options: ['Liver', 'Pancreas', 'Kidney', 'Stomach'], correctAnswer: 1 },
    { question: "What is the capital of Argentina?", options: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'], correctAnswer: 0 },
    { question: "How many colors are in a rainbow?", options: ['5', '6', '7', '8'], correctAnswer: 2 },
    { question: "Which metal is the best conductor of electricity?", options: ['Gold', 'Silver', 'Copper', 'Aluminum'], correctAnswer: 1 },
    { question: "What is the deepest ocean trench?", options: ['Puerto Rico Trench', 'Java Trench', 'Mariana Trench', 'Tonga Trench'], correctAnswer: 2 },
    { question: "Which gas is most abundant in the Sun?", options: ['Oxygen', 'Helium', 'Hydrogen', 'Carbon'], correctAnswer: 2 },
    { question: "What is the capital of Turkey?", options: ['Istanbul', 'Ankara', 'Izmir', 'Bursa'], correctAnswer: 1 },
    { question: "How many vertebrae are in the human spine?", options: ['24', '26', '33', '35'], correctAnswer: 2 },
    { question: "Which planet is known as the Evening Star?", options: ['Mars', 'Jupiter', 'Venus', 'Mercury'], correctAnswer: 2 }
];

// Diverse Hard Questions (50 unique questions)
const hardQuestions = [
    { question: "What is the value of Planck's constant?", options: ['6.626 × 10^-34 J·s', '3.141 × 10^-34 J·s', '9.81 × 10^-34 J·s', '1.602 × 10^-34 J·s'], correctAnswer: 0 },
    { question: "Which element has the highest melting point?", options: ['Tungsten', 'Carbon', 'Osmium', 'Rhenium'], correctAnswer: 1 },
    { question: "What is the half-life of Carbon-14?", options: ['1,730 years', '5,730 years', '10,730 years', '15,730 years'], correctAnswer: 1 },
    { question: "Which physicist developed the theory of general relativity?", options: ['Niels Bohr', 'Werner Heisenberg', 'Albert Einstein', 'Max Planck'], correctAnswer: 2 },
    { question: "What is the Chandrasekhar limit?", options: ['1.4 solar masses', '2.4 solar masses', '3.4 solar masses', '4.4 solar masses'], correctAnswer: 0 },
    { question: "Which quark has the largest mass?", options: ['Up', 'Down', 'Top', 'Bottom'], correctAnswer: 2 },
    { question: "What is the fine-structure constant approximately equal to?", options: ['1/137', '1/100', '1/50', '1/10'], correctAnswer: 0 },
    { question: "Which mathematician proved Fermat's Last Theorem?", options: ['Andrew Wiles', 'John Nash', 'Grigori Perelman', 'Terence Tao'], correctAnswer: 0 },
    { question: "What is the Riemann Hypothesis related to?", options: ['Prime numbers', 'Quantum mechanics', 'General relativity', 'String theory'], correctAnswer: 0 },
    { question: "Which particle is its own antiparticle?", options: ['Electron', 'Proton', 'Photon', 'Neutron'], correctAnswer: 2 },
    { question: "What is the Boltzmann constant?", options: ['1.38 × 10^-23 J/K', '6.63 × 10^-34 J/K', '8.31 × 10^-23 J/K', '9.11 × 10^-31 J/K'], correctAnswer: 0 },
    { question: "Which enzyme is responsible for DNA replication?", options: ['RNA polymerase', 'DNA polymerase', 'Ligase', 'Helicase'], correctAnswer: 1 },
    { question: "What is the Hubble constant approximately?", options: ['50 km/s/Mpc', '70 km/s/Mpc', '90 km/s/Mpc', '110 km/s/Mpc'], correctAnswer: 1 },
    { question: "Which amino acid is not chiral?", options: ['Alanine', 'Glycine', 'Serine', 'Valine'], correctAnswer: 1 },
    { question: "What is the critical temperature of water?", options: ['374°C', '400°C', '450°C', '500°C'], correctAnswer: 0 },
    { question: "Which theorem states that no three positive integers a, b, and c satisfy a^n + b^n = c^n for n > 2?", options: ['Pythagorean theorem', 'Fermat\'s Last Theorem', 'Gödel\'s incompleteness theorem', 'Central limit theorem'], correctAnswer: 1 },
    { question: "What is the mass of a proton in atomic mass units?", options: ['1.007276 u', '1.008665 u', '0.000548 u', '12.000000 u'], correctAnswer: 0 },
    { question: "Which force is the strongest at the subatomic level?", options: ['Gravitational', 'Electromagnetic', 'Weak nuclear', 'Strong nuclear'], correctAnswer: 3 },
    { question: "What is the Avogadro constant?", options: ['6.022 × 10^23 mol^-1', '1.381 × 10^-23 mol^-1', '9.109 × 10^-31 mol^-1', '1.602 × 10^-19 mol^-1'], correctAnswer: 0 },
    { question: "Which planet has the highest density?", options: ['Earth', 'Mercury', 'Venus', 'Mars'], correctAnswer: 0 },
    { question: "What is the Stefan-Boltzmann constant?", options: ['5.67 × 10^-8 W/m²K⁴', '1.38 × 10^-23 W/m²K⁴', '8.85 × 10^-12 W/m²K⁴', '4π × 10^-7 W/m²K⁴'], correctAnswer: 0 },
    { question: "Which element was the first to be synthesized artificially?", options: ['Technetium', 'Plutonium', 'Americium', 'Curium'], correctAnswer: 0 },
    { question: "What is the speed of sound in air at 20°C?", options: ['331 m/s', '343 m/s', '355 m/s', '367 m/s'], correctAnswer: 1 },
    { question: "Which mathematician developed calculus independently of Newton?", options: ['Pierre-Simon Laplace', 'Gottfried Wilhelm Leibniz', 'Leonhard Euler', 'Carl Friedrich Gauss'], correctAnswer: 1 },
    { question: "What is the rest mass energy of an electron?", options: ['0.511 MeV', '0.938 MeV', '1.022 MeV', '938 MeV'], correctAnswer: 0 },
    { question: "Which law states that the entropy of a perfect crystal at absolute zero is exactly zero?", options: ['First law of thermodynamics', 'Second law of thermodynamics', 'Third law of thermodynamics', 'Zeroth law of thermodynamics'], correctAnswer: 2 },
    { question: "What is the Compton wavelength of an electron?", options: ['2.426 × 10^-12 m', '1.213 × 10^-12 m', '4.852 × 10^-12 m', '9.704 × 10^-12 m'], correctAnswer: 0 },
    { question: "Which particle mediates the electromagnetic force?", options: ['Gluon', 'W boson', 'Photon', 'Z boson'], correctAnswer: 2 },
    { question: "What is the gravitational constant G?", options: ['6.674 × 10^-11 m³/kg·s²', '9.807 × 10^-11 m³/kg·s²', '1.602 × 10^-11 m³/kg·s²', '8.854 × 10^-11 m³/kg·s²'], correctAnswer: 0 },
    { question: "Which enzyme catalyzes the conversion of glucose to glucose-6-phosphate?", options: ['Hexokinase', 'Phosphofructokinase', 'Pyruvate kinase', 'Aldolase'], correctAnswer: 0 },
    { question: "What is the Debye length in plasma physics?", options: ['Distance over which electric fields are screened', 'Wavelength of plasma oscillations', 'Mean free path of particles', 'Gyroradius of charged particles'], correctAnswer: 0 },
    { question: "Which theorem proves that there are infinitely many prime numbers?", options: ['Euclid\'s theorem', 'Fermat\'s theorem', 'Wilson\'s theorem', 'Euler\'s theorem'], correctAnswer: 0 },
    { question: "What is the ionization energy of hydrogen?", options: ['13.6 eV', '10.2 eV', '1.89 eV', '0.85 eV'], correctAnswer: 0 },
    { question: "Which mathematician solved the Poincaré conjecture?", options: ['Andrew Wiles', 'Grigori Perelman', 'Terence Tao', 'Maryam Mirzakhani'], correctAnswer: 1 },
    { question: "What is the Bohr radius?", options: ['0.529 × 10^-10 m', '1.058 × 10^-10 m', '2.116 × 10^-10 m', '4.232 × 10^-10 m'], correctAnswer: 0 },
    { question: "Which force is responsible for beta decay?", options: ['Strong nuclear', 'Electromagnetic', 'Weak nuclear', 'Gravitational'], correctAnswer: 2 },
    { question: "What is the Rydberg constant?", options: ['1.097 × 10^7 m^-1', '6.626 × 10^7 m^-1', '3.141 × 10^7 m^-1', '2.998 × 10^7 m^-1'], correctAnswer: 0 },
    { question: "Which element has the electron configuration [Ar] 4s¹ 3d⁵?", options: ['Chromium', 'Manganese', 'Iron', 'Cobalt'], correctAnswer: 0 },
    { question: "What is the Heisenberg uncertainty principle?", options: ['ΔxΔp ≥ ħ/2', 'ΔEΔt ≥ ħ/2', 'Both A and B', 'Neither A nor B'], correctAnswer: 2 },
    { question: "Which particle has zero rest mass?", options: ['Electron', 'Proton', 'Neutron', 'Photon'], correctAnswer: 3 },
    { question: "What is the cosmic microwave background temperature?", options: ['1.5 K', '2.7 K', '3.5 K', '4.2 K'], correctAnswer: 1 },
    { question: "Which law relates pressure and volume of a gas at constant temperature?", options: ['Charles\'s law', 'Gay-Lussac\'s law', 'Boyle\'s law', 'Avogadro\'s law'], correctAnswer: 2 },
    { question: "What is the Schwarzschild radius of a black hole?", options: ['2GM/c²', 'GM/c²', '4GM/c²', 'GM/2c²'], correctAnswer: 0 },
    { question: "Which amino acid contains sulfur?", options: ['Alanine', 'Glycine', 'Cysteine', 'Serine'], correctAnswer: 2 },
    { question: "What is the Josephson constant?", options: ['483597.8484... GHz/V', '25812.807... Ω', '6.626... × 10^-34 J·s', '1.602... × 10^-19 C'], correctAnswer: 0 },
    { question: "Which theorem states that every even integer greater than 2 can be expressed as the sum of two primes?", options: ['Fermat\'s Last Theorem', 'Goldbach\'s conjecture', 'Twin prime conjecture', 'Riemann Hypothesis'], correctAnswer: 1 },
    { question: "What is the magnetic moment of an electron?", options: ['9.274 × 10^-24 J/T', '1.411 × 10^-26 J/T', '5.051 × 10^-27 J/T', '1.602 × 10^-19 J/T'], correctAnswer: 0 },
    { question: "Which enzyme is inhibited by cyanide?", options: ['Cytochrome c oxidase', 'ATP synthase', 'Hexokinase', 'DNA polymerase'], correctAnswer: 0 },
    { question: "What is the Wien displacement law constant?", options: ['2898 μm·K', '5670 μm·K', '8314 μm·K', '6022 μm·K'], correctAnswer: 0 },
    { question: "Which mathematician developed group theory?", options: ['Évariste Galois', 'Niels Henrik Abel', 'Arthur Cayley', 'Augustin-Louis Cauchy'], correctAnswer: 0 }
];

// Initialize the app
function initApp() {
    // Set up event listeners for difficulty buttons
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentDifficulty = button.getAttribute('data-difficulty');
            startQuiz();
        });
    });
    
    // Set up event listeners for question count buttons
    countButtons.forEach(button => {
        button.addEventListener('click', () => {
            questionCount = parseInt(button.getAttribute('data-count'));
            // Update UI to show selected count
            countButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
    
    // Set up next button
    nextBtn.addEventListener('click', nextQuestion);
    
    // Set up restart button
    restartBtn.addEventListener('click', restartQuiz);
    
    // Set default selected count button
    document.querySelector('.count-btn[data-count="20"]').classList.add('selected');
}

// Start the quiz
function startQuiz() {
    // Select appropriate questions based on difficulty
    let questionsPool = [];
    switch(currentDifficulty) {
        case 'easy':
            questionsPool = [...easyQuestions];
            break;
        case 'normal':
            questionsPool = [...normalQuestions];
            break;
        case 'hard':
            questionsPool = [...hardQuestions];
            break;
        default:
            questionsPool = [...easyQuestions];
    }
    
    // Shuffle questions and select the requested number (or all if fewer available)
    const shuffledQuestions = shuffleArray(questionsPool);
    const maxAvailable = shuffledQuestions.length;
    const actualQuestionCount = Math.min(questionCount, maxAvailable);
    availableQuestions = shuffledQuestions.slice(0, actualQuestionCount);
    
    // Reset variables
    currentQuestionIndex = 0;
    score = 0;
    timer = 0;
    userAnswers = new Array(availableQuestions.length).fill(null);
    
    // Start timer
    startTimer();
    
    // Show quiz page
    difficultyPage.style.display = 'none';
    quizPage.style.display = 'block';
    resultsPage.style.display = 'none';
    
    // Display first question
    displayQuestion();
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= availableQuestions.length) {
        endQuiz();
        return;
    }
    
    const currentQuestion = availableQuestions[currentQuestionIndex];
    
    // Update UI
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = availableQuestions.length;
    document.getElementById('score').textContent = score;
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    // Clear previous options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Add options
    currentQuestion.options.forEach((option, index) => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.setAttribute('data-index', index);
        optionBtn.addEventListener('click', () => selectAnswer(optionBtn, index));
        optionsContainer.appendChild(optionBtn);
    });
    
    // Hide next button until answer is selected
    nextBtn.style.display = 'none';
}

// Handle answer selection
function selectAnswer(optionBtn, selectedIndex) {
    // If already answered this question, do nothing
    if (userAnswers[currentQuestionIndex] !== null) return;
    
    const currentQuestion = availableQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    
    // Store the user's answer
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    // Highlight correct/incorrect answer
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        if (index === currentQuestion.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update score if correct
    if (isCorrect) {
        score++;
        document.getElementById('score').textContent = score;
    }
    
    // Show next button
    nextBtn.style.display = 'block';
}

// Go to next question
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// End quiz
function endQuiz() {
    // Stop timer
    clearInterval(timerInterval);
    
    // Calculate results
    const timeTaken = timer;
    const percentage = Math.round((score / availableQuestions.length) * 100);
    let grade = '';
    let description = '';
    let gradeClass = '';
    
    // Determine grade based on percentage
    if (percentage >= 95) {
        grade = 'S';
        description = 'Excellent';
        gradeClass = 'grade-S';
    } else if (percentage >= 90) {
        grade = 'A';
        description = 'Great';
        gradeClass = 'grade-A';
    } else if (percentage >= 70) {
        grade = 'B';
        description = 'Very Good';
        gradeClass = 'grade-B';
    } else if (percentage >= 60) {
        grade = 'C';
        description = 'Good';
        gradeClass = 'grade-C';
    } else if (percentage >= 50) {
        grade = 'D';
        description = 'Medium';
        gradeClass = 'grade-D';
    } else if (percentage >= 30) {
        grade = 'E';
        description = 'Bad';
        gradeClass = 'grade-E';
    } else {
        grade = 'F';
        description = 'Very Bad';
        gradeClass = 'grade-F';
    }
    
    // Display results
    document.getElementById('result-difficulty').textContent = currentDifficulty;
    document.getElementById('result-time').textContent = formatTime(timeTaken);
    document.getElementById('result-grade').textContent = grade;
    document.getElementById('result-grade').className = gradeClass;
    document.getElementById('result-description').textContent = description;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = availableQuestions.length;
    
    // Show results page
    quizPage.style.display = 'none';
    resultsPage.style.display = 'block';
}

// Start timer
function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timer = 0;
    document.getElementById('timer').textContent = formatTime(timer);
    
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = formatTime(timer);
    }, 1000);
}

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Restart quiz
function restartQuiz() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = '00:00'; // Reset display
    difficultyPage.style.display = 'block';
    quizPage.style.display = 'none';
    resultsPage.style.display = 'none';
    countButtons.forEach(btn => btn.classList.remove('selected'));
    document.querySelector('.count-btn[data-count="20"]').classList.add('selected');
    questionCount = 20;
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize the app when page loads
window.addEventListener('DOMContentLoaded', initApp);









