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
const exitBtn = document.getElementById('exit-btn');

// Diverse Easy Questions (50 unique questions)

// Easy Math Questions (100 questions - Below High School Level)
const easyQuestions = [
    { question: "What is 7 × 8?", options: ['54', '56', '64', '72'], correctAnswer: 1 },
    { question: "What is 3/4 + 1/4?", options: ['1', '1/2', '4/8', '2'], correctAnswer: 0 },
    { question: "What is the area of a square with side length 5?", options: ['10', '20', '25', '30'], correctAnswer: 2 },
    { question: "Which number is prime?", options: ['9', '15', '21', '17'], correctAnswer: 3 },
    { question: "What is 20% of 150?", options: ['20', '25', '30', '35'], correctAnswer: 2 },
    { question: "Solve for x: x + 5 = 12", options: ['5', '6', '7', '8'], correctAnswer: 2 },
    { question: "How many sides does a hexagon have?", options: ['5', '6', '7', '8'], correctAnswer: 1 },
    { question: "What is 4² + 3²?", options: ['12', '16', '20', '25'], correctAnswer: 3 },
    { question: "What is the perimeter of a rectangle with length 6 and width 4?", options: ['10', '20', '24', '30'], correctAnswer: 1 },
    { question: "Which is the smallest fraction?", options: ['1/2', '1/3', '1/4', '1/5'], correctAnswer: 3 },
    { question: "What is 12 ÷ (3 + 1)?", options: ['2', '3', '4', '6'], correctAnswer: 1 },
    { question: "What is the next number: 2, 4, 6, 8, ...?", options: ['9', '10', '11', '12'], correctAnswer: 1 },
    { question: "What is 0.5 as a fraction?", options: ['1/4', '1/3', '1/2', '2/3'], correctAnswer: 2 },
    { question: "What is the sum of angles in a triangle?", options: ['90°', '180°', '270°', '360°'], correctAnswer: 1 },
    { question: "What is √64?", options: ['6', '7', '8', '9'], correctAnswer: 2 },
    { question: "If a pizza is cut into 8 slices and you eat 3, what fraction is left?", options: ['3/8', '4/8', '5/8', '6/8'], correctAnswer: 2 },
    { question: "What is 3.5 + 2.7?", options: ['5.2', '6.0', '6.2', '6.5'], correctAnswer: 2 },
    { question: "Which is NOT divisible by 3?", options: ['21', '24', '28', '30'], correctAnswer: 2 },
    { question: "What is the mode of: 2, 3, 3, 4, 5?", options: ['2', '3', '4', '5'], correctAnswer: 1 },
    { question: "What is 100 – 37?", options: ['63', '73', '67', '77'], correctAnswer: 0 },
    { question: "What is 9 × 7?", options: ['63', '64', '72', '81'], correctAnswer: 0 },
    { question: "What is 1/2 × 1/3?", options: ['1/5', '1/6', '2/5', '2/3'], correctAnswer: 1 },
    { question: "How many minutes are in 2.5 hours?", options: ['120', '130', '150', '180'], correctAnswer: 2 },
    { question: "What is the median of: 1, 3, 5, 7, 9?", options: ['3', '5', '7', '9'], correctAnswer: 1 },
    { question: "What is 15% of 200?", options: ['15', '20', '30', '45'], correctAnswer: 2 },
    { question: "Which shape has 4 equal sides and 4 right angles?", options: ['Rectangle', 'Rhombus', 'Square', 'Parallelogram'], correctAnswer: 2 },
    { question: "What is 64 ÷ 8?", options: ['6', '7', '8', '9'], correctAnswer: 2 },
    { question: "What is 2³?", options: ['4', '6', '8', '9'], correctAnswer: 2 },
    { question: "What is the least common multiple of 4 and 6?", options: ['12', '24', '8', '18'], correctAnswer: 0 },
    { question: "If 3 apples cost $1.50, how much is 1 apple?", options: ['$0.30', '$0.40', '$0.50', '$0.60'], correctAnswer: 2 },
    { question: "What is 7.2 – 3.8?", options: ['3.4', '3.6', '4.4', '4.6'], correctAnswer: 0 },
    { question: "How many edges does a cube have?", options: ['6', '8', '12', '16'], correctAnswer: 2 },
    { question: "What is 5! (5 factorial)?", options: ['20', '60', '120', '240'], correctAnswer: 2 },
    { question: "Which is greater: 0.75 or 3/5?", options: ['0.75', '3/5', 'They are equal', 'Cannot compare'], correctAnswer: 0 },
    { question: "What is the range of: 10, 15, 20, 25?", options: ['10', '15', '20', '25'], correctAnswer: 1 },
    { question: "Solve: 4x = 20", options: ['x=4', 'x=5', 'x=6', 'x=8'], correctAnswer: 1 },
    { question: "What is the circumference of a circle with diameter 7? (Use π≈22/7)", options: ['22', '44', '154', '77'], correctAnswer: 0 },
    { question: "What is -5 + 9?", options: ['4', '-4', '14', '-14'], correctAnswer: 0 },
    { question: "How many seconds are in 5 minutes?", options: ['30', '300', '500', '600'], correctAnswer: 1 },
    { question: "What is the greatest common factor of 12 and 18?", options: ['3', '6', '9', '12'], correctAnswer: 1 },
    { question: "What is 0.25 as a percentage?", options: ['2.5%', '25%', '250%', '0.25%'], correctAnswer: 1 },
    { question: "Which number is a perfect square?", options: ['20', '25', '30', '35'], correctAnswer: 1 },
    { question: "What is 18 ÷ 0.5?", options: ['9', '18', '36', '72'], correctAnswer: 2 },
    { question: "If a triangle has angles 30° and 60°, what is the third angle?", options: ['60°', '90°', '120°', '180°'], correctAnswer: 1 },
    { question: "What is 12 × 11?", options: ['121', '132', '144', '156'], correctAnswer: 1 },
    { question: "What is the volume of a cube with side 3?", options: ['9', '18', '27', '36'], correctAnswer: 2 },
    { question: "Which is NOT an even number?", options: ['42', '56', '73', '88'], correctAnswer: 2 },
    { question: "What is 3/5 as a decimal?", options: ['0.3', '0.5', '0.6', '0.8'], correctAnswer: 2 },
    { question: "How many quarters are in $2.50?", options: ['8', '10', '12', '15'], correctAnswer: 1 },
    { question: "What is 1000 – 287?", options: ['713', '723', '813', '823'], correctAnswer: 0 },
    { question: "What is the average of 10, 20, and 30?", options: ['15', '20', '25', '30'], correctAnswer: 1 },
    { question: "What is 7 × 7?", options: ['42', '49', '56', '63'], correctAnswer: 1 },
    { question: "What is 1/4 + 1/2?", options: ['1/6', '2/6', '3/4', '1/8'], correctAnswer: 2 },
    { question: "How many days are in February during a leap year?", options: ['28', '29', '30', '31'], correctAnswer: 1 },
    { question: "What is 6² – 4²?", options: ['10', '20', '30', '40'], correctAnswer: 1 },
    { question: "Which number is divisible by both 2 and 5?", options: ['15', '20', '25', '30'], correctAnswer: 1 },
    { question: "What is 0.9 × 0.2?", options: ['0.18', '1.8', '0.018', '18'], correctAnswer: 0 },
    { question: "What is the next number: 1, 1, 2, 3, 5, ...?", options: ['6', '7', '8', '9'], correctAnswer: 2 },
    { question: "What is 50% of 80?", options: ['20', '30', '40', '50'], correctAnswer: 2 },
    { question: "How many vertices does a triangular prism have?", options: ['5', '6', '8', '9'], correctAnswer: 1 },
    { question: "What is 15 + (–7)?", options: ['8', '–8', '22', '–22'], correctAnswer: 0 },
    { question: "What is the area of a triangle with base 10 and height 4?", options: ['20', '40', '80', '100'], correctAnswer: 0 },
    { question: "Which fraction is equivalent to 2/3?", options: ['4/5', '6/9', '8/10', '10/15'], correctAnswer: 1 },
    { question: "What is 99 ÷ 9?", options: ['9', '10', '11', '12'], correctAnswer: 2 },
    { question: "What is 2.5 × 4?", options: ['8', '9', '10', '11'], correctAnswer: 2 },
    { question: "How many millimeters are in 3.5 centimeters?", options: ['35', '350', '3.5', '0.35'], correctAnswer: 0 },
    { question: "What is the square root of 121?", options: ['10', '11', '12', '13'], correctAnswer: 1 },
    { question: "If you buy 3 pens for $4.50, how much is each pen?", options: ['$1.00', '$1.25', '$1.50', '$2.00'], correctAnswer: 2 },
    { question: "What is 8 × 0.125?", options: ['0.1', '0.5', '1', '2'], correctAnswer: 2 },
    { question: "Which is the largest?", options: ['0.9', '0.89', '0.91', '0.899'], correctAnswer: 2 },
    { question: "What is 10² – 6²?", options: ['36', '64', '100', '136'], correctAnswer: 1 },
    { question: "How many ounces are in 2 pounds? (1 lb = 16 oz)", options: ['16', '24', '32', '48'], correctAnswer: 2 },
    { question: "What is 3/8 + 1/8?", options: ['1/4', '1/2', '3/4', '1'], correctAnswer: 1 },
    { question: "What is the product of 12 and 13?", options: ['144', '156', '169', '182'], correctAnswer: 1 },
    { question: "What is –3 × 4?", options: ['12', '–12', '7', '–7'], correctAnswer: 1 },
    { question: "What is the perimeter of an equilateral triangle with side 9?", options: ['18', '27', '36', '81'], correctAnswer: 1 },
    { question: "Which number is a multiple of 9?", options: ['54', '56', '58', '60'], correctAnswer: 0 },
    { question: "What is 7.5 ÷ 0.5?", options: ['1.5', '7.5', '15', '75'], correctAnswer: 2 },
    { question: "What is 1/10 as a decimal?", options: ['0.01', '0.1', '1.0', '10.0'], correctAnswer: 1 },
    { question: "How many faces does a rectangular prism have?", options: ['4', '5', '6', '8'], correctAnswer: 2 },
    { question: "What is 200 ÷ 25?", options: ['4', '6', '8', '10'], correctAnswer: 2 },
    { question: "What is the next number: 100, 90, 80, 70, ...?", options: ['60', '65', '70', '75'], correctAnswer: 0 },
    { question: "What is 15 × 6?", options: ['80', '90', '100', '110'], correctAnswer: 1 },
    { question: "What is 4.8 + 5.2?", options: ['9.0', '9.8', '10.0', '10.2'], correctAnswer: 2 },
    { question: "Which is NOT a factor of 24?", options: ['3', '4', '6', '7'], correctAnswer: 3 },
    { question: "What is 1000 × 0.01?", options: ['1', '10', '100', '1000'], correctAnswer: 1 },
    { question: "What is the area of a rectangle with length 12 and width 5?", options: ['34', '60', '120', '144'], correctAnswer: 1 },
    { question: "What is 9²?", options: ['18', '81', '90', '99'], correctAnswer: 1 },
    { question: "How many dimes are in $3.00?", options: ['15', '20', '30', '60'], correctAnswer: 2 },
    { question: "What is 1/3 of 27?", options: ['6', '9', '12', '18'], correctAnswer: 1 },
    { question: "What is 55 – 28?", options: ['27', '28', '29', '30'], correctAnswer: 0 },
    { question: "What is the value of 2⁴?", options: ['8', '12', '16', '20'], correctAnswer: 2 },
    { question: "Which decimal is equal to 3/8?", options: ['0.25', '0.375', '0.4', '0.625'], correctAnswer: 1 },
    { question: "What is 60 ÷ 12?", options: ['4', '5', '6', '7'], correctAnswer: 1 },
    { question: "What is the sum of the first 5 odd numbers?", options: ['20', '25', '30', '35'], correctAnswer: 1 },
    { question: "If a book costs $12 and is on sale for 25% off, what is the sale price?", options: ['$8', '$9', '$10', '$11'], correctAnswer: 1 },
    { question: "What is 0.6 × 0.5?", options: ['0.03', '0.3', '3.0', '30'], correctAnswer: 1 },
    { question: "How many lines of symmetry does a square have?", options: ['2', '3', '4', '8'], correctAnswer: 2 },
    { question: "What is 100 ÷ 0.25?", options: ['25', '100', '250', '400'], correctAnswer: 3 },
    { question: "What is the least common denominator of 1/4 and 1/6?", options: ['10', '12', '24', '48'], correctAnswer: 1 }
];


// Normal Math Questions (100 questions - High School to Early College)
const normalQuestions = [
    { question: "Solve: 2x + 5 = 15", options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'], correctAnswer: 1 },
    { question: "What is sin(90°)?", options: ['0', '0.5', '1', '√2/2'], correctAnswer: 2 },
    { question: "What is the derivative of x²?", options: ['x', '2x', 'x²', '2'], correctAnswer: 1 },
    { question: "Solve: x² – 5x + 6 = 0", options: ['x=1,6', 'x=2,3', 'x=-2,-3', 'x=0,5'], correctAnswer: 1 },
    { question: "What is log₁₀(100)?", options: ['1', '2', '10', '100'], correctAnswer: 1 },
    { question: "What is the slope of the line y = 3x + 2?", options: ['2', '3', '5', '0'], correctAnswer: 1 },
    { question: "What is the integral of 2x dx?", options: ['x² + C', '2x² + C', 'x + C', '2 + C'], correctAnswer: 0 },
    { question: "Which identity is correct?", options: ['sin²x + cos²x = 1', 'sinx + cosx = 1', 'tanx = sinx/cosx', 'Both A and C'], correctAnswer: 3 },
    { question: "What is the limit as x→0 of (sin x)/x?", options: ['0', '1', '∞', 'Undefined'], correctAnswer: 1 },
    { question: "What is i²?", options: ['1', '-1', 'i', '-i'], correctAnswer: 1 },
    { question: "What is the vertex of y = (x – 2)² + 3?", options: ['(2,3)', '(-2,3)', '(3,2)', '(0,3)'], correctAnswer: 0 },
    { question: "Solve: |x – 3| = 5", options: ['x=8', 'x=-2', 'x=8 or -2', 'No solution'], correctAnswer: 2 },
    { question: "What is the period of sin(x)?", options: ['π', '2π', 'π/2', '4π'], correctAnswer: 1 },
    { question: "What is the determinant of [[2,3],[1,4]]?", options: ['5', '6', '7', '8'], correctAnswer: 0 },
    { question: "Which is the equation of a circle with center (0,0) and radius 5?", options: ['x² + y² = 5', 'x² + y² = 25', 'x + y = 5', '(x-5)² + y² = 0'], correctAnswer: 1 },
    { question: "What is e⁰?", options: ['0', '1', 'e', 'Undefined'], correctAnswer: 1 },
    { question: "Simplify: (x³)²", options: ['x⁵', 'x⁶', 'x⁹', '2x³'], correctAnswer: 1 },
    { question: "What is the sum of the first 10 positive integers?", options: ['45', '50', '55', '60'], correctAnswer: 2 },
    { question: "What is tan(45°)?", options: ['0', '0.5', '1', '√3'], correctAnswer: 2 },
    { question: "If f(x) = 2x + 1, what is f⁻¹(5)?", options: ['2', '3', '4', '5'], correctAnswer: 0 },
    { question: "What is the solution to 3x – 7 = 2x + 5?", options: ['x = 2', 'x = 8', 'x = 10', 'x = 12'], correctAnswer: 3 },
    { question: "What is cos(60°)?", options: ['0', '0.5', '√2/2', '√3/2'], correctAnswer: 1 },
    { question: "What is the derivative of sin(x)?", options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correctAnswer: 0 },
    { question: "Solve: 2^(x+1) = 16", options: ['x=2', 'x=3', 'x=4', 'x=5'], correctAnswer: 1 },
    { question: "What is the range of f(x) = x²?", options: ['All real numbers', 'x ≥ 0', 'x ≤ 0', 'x ≠ 0'], correctAnswer: 1 },
    { question: "What is the value of log₂(8)?", options: ['2', '3', '4', '8'], correctAnswer: 1 },
    { question: "Which is the inverse of f(x) = 3x?", options: ['f⁻¹(x) = x/3', 'f⁻¹(x) = 3/x', 'f⁻¹(x) = -3x', 'f⁻¹(x) = x+3'], correctAnswer: 0 },
    { question: "What is the area of a sector with angle 60° in a circle of radius 6?", options: ['6π', '12π', '18π', '36π'], correctAnswer: 0 },
    { question: "What is the standard deviation of: 2, 4, 6, 8, 10?", options: ['2', '2.83', '3', '4'], correctAnswer: 1 },
    { question: "What is the probability of rolling a 4 on a fair die?", options: ['1/2', '1/3', '1/4', '1/6'], correctAnswer: 3 },
    { question: "What is the equation of the line through (1,2) and (3,6)?", options: ['y = 2x', 'y = 2x + 1', 'y = 3x – 1', 'y = x + 1'], correctAnswer: 0 },
    { question: "What is the magnitude of vector <3,4>?", options: ['5', '7', '12', '25'], correctAnswer: 0 },
    { question: "Solve: x² + 4 = 0", options: ['x = ±2', 'x = ±2i', 'x = ±4', 'No real solution'], correctAnswer: 1 },
    { question: "What is the derivative of ln(x)?", options: ['1/x', 'x', 'eˣ', '1/ln(x)'], correctAnswer: 0 },
    { question: "What is the sum of the geometric series: 1 + 1/2 + 1/4 + ...?", options: ['1', '1.5', '2', '∞'], correctAnswer: 2 },
    { question: "What is the domain of f(x) = √(x – 3)?", options: ['x > 3', 'x ≥ 3', 'x < 3', 'All real numbers'], correctAnswer: 1 },
    { question: "What is the value of sin(π/6)?", options: ['0', '0.5', '√2/2', '√3/2'], correctAnswer: 1 },
    { question: "What is the integral of cos(x) dx?", options: ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C'], correctAnswer: 0 },
    { question: "Which matrix is the identity matrix?", options: ['[[1,0],[0,1]]', '[[0,1],[1,0]]', '[[1,1],[1,1]]', '[[2,0],[0,2]]'], correctAnswer: 0 },
    { question: "What is the solution to the system: x + y = 5, x – y = 1?", options: ['(2,3)', '(3,2)', '(4,1)', '(1,4)'], correctAnswer: 1 },
    { question: "What is the amplitude of y = 4 sin(x)?", options: ['1', '2', '4', '8'], correctAnswer: 2 },
    { question: "What is the value of 5P2 (permutations)?", options: ['10', '20', '25', '120'], correctAnswer: 1 },
    { question: "What is the focus of the parabola y = x²?", options: ['(0,0)', '(0,1/4)', '(0,1)', '(1,0)'], correctAnswer: 1 },
    { question: "What is the derivative of eˣ?", options: ['eˣ', 'x eˣ⁻¹', 'ln(x)', '1/eˣ'], correctAnswer: 0 },
    { question: "What is the value of cos(π)?", options: ['1', '0', '-1', 'Undefined'], correctAnswer: 2 },
    { question: "What is the equation of a line with slope -2 and y-intercept 3?", options: ['y = 2x + 3', 'y = -2x + 3', 'y = 3x – 2', 'y = -3x + 2'], correctAnswer: 1 },
    { question: "What is the median of: 1, 3, 5, 7, 9, 11?", options: ['5', '6', '7', '8'], correctAnswer: 1 },
    { question: "What is the value of tan(π/4)?", options: ['0', '1', '√3', 'Undefined'], correctAnswer: 1 },
    { question: "What is the solution to 5ˣ = 125?", options: ['x=2', 'x=3', 'x=4', 'x=5'], correctAnswer: 1 },
    { question: "What is the variance of: 1, 1, 1, 1?", options: ['0', '1', '4', 'Undefined'], correctAnswer: 0 },
    { question: "What is the horizontal asymptote of f(x) = (2x + 1)/(x – 3)?", options: ['y = 0', 'y = 2', 'y = 3', 'None'], correctAnswer: 1 },
    { question: "What is the value of log₅(1)?", options: ['0', '1', '5', 'Undefined'], correctAnswer: 0 },
    { question: "What is the derivative of 3x⁴?", options: ['3x³', '12x³', 'x⁴', '12x⁴'], correctAnswer: 1 },
    { question: "What is the area under y = x from 0 to 2?", options: ['1', '2', '3', '4'], correctAnswer: 1 },
    { question: "What is the value of sin(30°) + cos(60°)?", options: ['0', '0.5', '1', '√3'], correctAnswer: 2 },
    { question: "What is the inverse of the function f(x) = x³?", options: ['f⁻¹(x) = x/3', 'f⁻¹(x) = √x', 'f⁻¹(x) = ∛x', 'f⁻¹(x) = x⁻³'], correctAnswer: 2 },
    { question: "What is the solution to x/2 + 3 = 7?", options: ['x=4', 'x=6', 'x=8', 'x=10'], correctAnswer: 2 },
    { question: "What is the value of sec(0°)?", options: ['0', '1', 'Undefined', '∞'], correctAnswer: 1 },
    { question: "What is the derivative of tan(x)?", options: ['sec(x)', 'sec²(x)', 'csc²(x)', '-sec²(x)'], correctAnswer: 1 },
    { question: "What is the value of 8C3 (combinations)?", options: ['28', '56', '336', '6720'], correctAnswer: 0 },
    { question: "What is the equation of the unit circle?", options: ['x² + y² = 1', 'x + y = 1', 'x² – y² = 1', 'xy = 1'], correctAnswer: 0 },
    { question: "What is the limit as x→2 of (x² – 4)/(x – 2)?", options: ['0', '2', '4', 'Undefined'], correctAnswer: 2 },
    { question: "What is the value of i⁴?", options: ['1', '-1', 'i', '-i'], correctAnswer: 0 },
    { question: "What is the period of y = cos(2x)?", options: ['π', '2π', '4π', 'π/2'], correctAnswer: 0 },
    { question: "What is the integral of 1/x dx?", options: ['ln|x| + C', 'x ln x + C', '1/x² + C', 'eˣ + C'], correctAnswer: 0 },
    { question: "What is the value of arcsin(1)?", options: ['0', 'π/6', 'π/4', 'π/2'], correctAnswer: 3 },
    { question: "What is the slope of a line perpendicular to y = 2x + 1?", options: ['2', '-2', '1/2', '-1/2'], correctAnswer: 3 },
    { question: "What is the value of log₁₀(1)?", options: ['0', '1', '10', '-1'], correctAnswer: 0 },
    { question: "What is the solution to 2x² – 8 = 0?", options: ['x=±2', 'x=±4', 'x=0', 'x=±√2'], correctAnswer: 0 },
    { question: "What is the value of cot(45°)?", options: ['0', '1', '√3', '1/√3'], correctAnswer: 1 },
    { question: "What is the derivative of √x?", options: ['1/(2√x)', '√x/2', '2√x', '1/√x'], correctAnswer: 0 },
    { question: "What is the value of sin(0°)?", options: ['0', '1', '-1', '0.5'], correctAnswer: 0 },
    { question: "What is the value of 7! / 5!?", options: ['42', '56', '120', '5040'], correctAnswer: 0 },
    { question: "What is the equation of a vertical line through x=3?", options: ['y=3', 'x=3', 'y=x+3', 'x+y=3'], correctAnswer: 1 },
    { question: "What is the value of cos(90°)?", options: ['0', '1', '-1', '0.5'], correctAnswer: 0 },
    { question: "What is the value of log₂(1/8)?", options: ['-3', '-2', '3', '8'], correctAnswer: 0 },
    { question: "What is the derivative of x³ + 2x?", options: ['3x² + 2', 'x² + 2', '3x²', 'x⁴/4 + x²'], correctAnswer: 0 },
    { question: "What is the value of tan(0°)?", options: ['0', '1', 'Undefined', '∞'], correctAnswer: 0 },
    { question: "What is the value of e^(ln 5)?", options: ['1', '5', 'ln 5', 'e⁵'], correctAnswer: 1 },
    { question: "What is the value of sin(π/2)?", options: ['0', '1', '-1', '0.5'], correctAnswer: 1 },
    { question: "What is the value of the determinant of [[1,2],[3,4]]?", options: ['-2', '2', '10', '-10'], correctAnswer: 0 },
    { question: "What is the value of csc(30°)?", options: ['0.5', '1', '2', '√2'], correctAnswer: 2 },
    { question: "What is the value of the limit as x→∞ of 1/x?", options: ['0', '1', '∞', 'Undefined'], correctAnswer: 0 },
    { question: "What is the value of (2 + 3i)(2 – 3i)?", options: ['4 – 9i²', '13', '-5', '4 + 9i'], correctAnswer: 1 },
    { question: "What is the value of the derivative of a constant?", options: ['0', '1', 'The constant', 'Undefined'], correctAnswer: 0 },
    { question: "What is the value of log₃(27)?", options: ['2', '3', '9', '27'], correctAnswer: 1 },
    { question: "What is the value of the integral from 0 to π of sin(x) dx?", options: ['0', '1', '2', 'π'], correctAnswer: 2 },
    { question: "What is the value of sec(60°)?", options: ['0.5', '1', '2', '√3'], correctAnswer: 2 },
    { question: "What is the value of the sum: Σ (from k=1 to 4) of k²?", options: ['10', '20', '30', '40'], correctAnswer: 2 },
    { question: "What is the value of the discriminant of x² – 4x + 4 = 0?", options: ['0', '4', '8', '16'], correctAnswer: 0 },
    { question: "What is the value of the slope of a horizontal line?", options: ['0', '1', 'Undefined', '∞'], correctAnswer: 0 },
    { question: "What is the value of the y-intercept of 2x + 3y = 6?", options: ['2', '3', '6', '0'], correctAnswer: 1 },
    { question: "What is the value of the derivative of cos(x)?", options: ['sin(x)', '-sin(x)', 'cos(x)', '-cos(x)'], correctAnswer: 1 },
    { question: "What is the value of the integral of eˣ dx?", options: ['eˣ + C', 'x eˣ + C', 'ln x + C', '1/eˣ + C'], correctAnswer: 0 },
    { question: "What is the value of the probability of a certain event?", options: ['0', '0.5', '1', '100'], correctAnswer: 2 },
    { question: "What is the value of the mode of: 2, 3, 3, 4, 4, 4, 5?", options: ['3', '4', '5', 'No mode'], correctAnswer: 1 },
    { question: "What is the value of the range of: 10, 20, 30, 40?", options: ['10', '20', '30', '40'], correctAnswer: 2 },
    { question: "What is the value of the standard form of a line?", options: ['y = mx + b', 'Ax + By = C', 'y – y₁ = m(x – x₁)', 'x = a'], correctAnswer: 1 },
    { question: "What is the value of the product of slopes of perpendicular lines?", options: ['1', '-1', '0', 'Undefined'], correctAnswer: 1 }
];


// Hard Math Questions (100 questions - College to Research Level)
const hardQuestions = [
    { question: "What is the value of ∫₀^∞ e⁻ˣ² dx?", options: ['1', '√π', '√π/2', 'π'], correctAnswer: 2 },
    { question: "Which of these is a Banach space?", options: ['C[0,1] with sup norm', 'Q with absolute value', 'R² with taxicab norm', 'All of the above'], correctAnswer: 0 },
    { question: "What is the Galois group of x³ – 2 over ℚ?", options: ['S₃', 'A₃', 'ℤ/3ℤ', 'Trivial'], correctAnswer: 0 },
    { question: "Which statement is true about the Riemann zeta function ζ(s)?", options: ['ζ(-1) = -1/12', 'ζ(0) = 0', 'ζ(2) = π²/6', 'All of the above'], correctAnswer: 3 },
    { question: "What is the dimension of the vector space of 3×3 skew-symmetric matrices?", options: ['3', '6', '9', '12'], correctAnswer: 0 },
    { question: "Which of the following is NOT a Hilbert space?", options: ['ℓ²', 'L²[0,1]', 'C[0,1] with L² norm', 'ℝⁿ with dot product'], correctAnswer: 2 },
    { question: "What is the residue of f(z) = 1/z at z=0?", options: ['0', '1', '-1', 'Undefined'], correctAnswer: 1 },
    { question: "Which group is simple?", options: ['ℤ/6ℤ', 'S₄', 'A₅', 'D₄'], correctAnswer: 2 },
    { question: "What is the solution to the PDE: ∂u/∂t = ∂²u/∂x² with u(x,0)=sin(x)?", options: ['e⁻ᵗ sin(x)', 'eᵗ sin(x)', 'sin(x+t)', 'sin(x-t)'], correctAnswer: 0 },
    { question: "In ZFC, which is independent of the axioms?", options: ['Continuum Hypothesis', 'Axiom of Choice', 'Peano axioms', 'Pythagorean theorem'], correctAnswer: 0 },
    { question: "What is the Fourier transform of e⁻|x|?", options: ['1/(1+ω²)', '2/(1+ω²)', '√(2/π)/(1+ω²)', 'π e⁻|ω|'], correctAnswer: 2 },
    { question: "Which ring is a UFD but not a PID?", options: ['ℤ', 'ℤ[x]', 'k[x,y]', 'Both B and C'], correctAnswer: 3 },
    { question: "What is the fundamental group of the circle S¹?", options: ['0', 'ℤ', 'ℤ/2ℤ', 'ℝ'], correctAnswer: 1 },
    { question: "Which matrix is diagonalizable over ℝ?", options: ['[[1,1],[0,1]]', '[[0,-1],[1,0]]', '[[2,1],[1,2]]', 'None'], correctAnswer: 2 },
    { question: "What is the Lebesgue measure of the Cantor set?", options: ['0', '1/3', '1/2', '1'], correctAnswer: 0 },
    { question: "Which function is harmonic?", options: ['x² + y²', 'x² – y²', 'eˣ sin y', 'Both B and C'], correctAnswer: 3 },
    { question: "What is the order of GL(2,𝔽₃)?", options: ['24', '48', '72', '96'], correctAnswer: 1 },
    { question: "Which space is compact?", options: ['(0,1)', 'ℝ', '[0,1]', 'ℚ ∩ [0,1]'], correctAnswer: 2 },
    { question: "What is d/dx (W(x)) where W is Lambert W function?", options: ['W(x)/(x(1+W(x)))', '1/(x W(x))', 'e⁻ˣ', 'W(x)/x'], correctAnswer: 0 },
    { question: "Which statement follows from Zorn’s Lemma?", options: ['Every vector space has a basis', 'ℝ is uncountable', 'Pythagorean theorem', 'Fundamental theorem of algebra'], correctAnswer: 0 },
    { question: "What is the spectral radius of [[0,1],[0,0]]?", options: ['0', '1', '2', 'Undefined'], correctAnswer: 0 },
    { question: "Which of the following is a σ-algebra on ℝ?", options: ['All open sets', 'All closed sets', 'Borel sets', 'All subsets'], correctAnswer: 2 },
    { question: "What is the value of the Gamma function Γ(1/2)?", options: ['1', '√π', 'π', '1/2'], correctAnswer: 1 },
    { question: "Which topology is Hausdorff?", options: ['Trivial topology', 'Cofinite topology on infinite set', 'Standard topology on ℝ', 'None'], correctAnswer: 2 },
    { question: "What is the degree of the field extension [ℚ(√2, √3):ℚ]?", options: ['2', '3', '4', '6'], correctAnswer: 2 },
    { question: "Which of the following is a complete metric space?", options: ['ℚ', '(0,1) with Euclidean metric', 'C[0,1] with sup norm', 'ℝ\\{0}'], correctAnswer: 2 },
    { question: "What is the dual space of ℓ¹?", options: ['ℓ¹', 'ℓ²', 'ℓ^∞', 'c₀'], correctAnswer: 2 },
    { question: "Which manifold is orientable?", options: ['Möbius strip', 'Klein bottle', 'Real projective plane', 'Torus'], correctAnswer: 3 },
    { question: "What is the value of the Riemann integral ∫₀¹ χ_ℚ(x) dx?", options: ['0', '1', 'Undefined', '1/2'], correctAnswer: 0 },
    { question: "Which of the following is a Noetherian ring?", options: ['ℤ[x₁,x₂,...]', 'C[0,1]', 'ℤ', 'All of the above'], correctAnswer: 2 },
    { question: "What is the solution to y'' + y = 0 with y(0)=0, y'(0)=1?", options: ['sin(x)', 'cos(x)', 'eˣ', 'x'], correctAnswer: 0 },
    { question: "Which of the following is a Sobolev space?", options: ['W^{1,2}(Ω)', 'C^∞(Ω)', 'L¹(Ω)', 'All of the above'], correctAnswer: 0 },
    { question: "What is the cardinality of the set of continuous functions ℝ→ℝ?", options: ['ℵ₀', '𝔠', '2^𝔠', 'Undefined'], correctAnswer: 1 },
    { question: "Which of the following is a Lie group?", options: ['GL(n,ℝ)', 'SL(n,ℝ)', 'O(n)', 'All of the above'], correctAnswer: 3 },
    { question: "What is the value of the improper integral ∫₁^∞ 1/x² dx?", options: ['0', '1', '∞', 'Diverges'], correctAnswer: 1 },
    { question: "Which of the following is a compact Lie group?", options: ['GL(n,ℝ)', 'SL(n,ℝ)', 'U(n)', 'None'], correctAnswer: 2 },
    { question: "What is the homology group H₁(S¹)?", options: ['0', 'ℤ', 'ℤ⊕ℤ', 'ℝ'], correctAnswer: 1 },
    { question: "Which of the following is a Dedekind domain?", options: ['ℤ', 'k[x]', 'Ring of integers in a number field', 'All of the above'], correctAnswer: 3 },
    { question: "What is the value of the Dirichlet eta function η(1)?", options: ['0', 'ln 2', 'π/4', '1'], correctAnswer: 1 },
    { question: "Which of the following is a C*-algebra?", options: ['C(X) for compact X', 'B(H) for Hilbert space H', 'Matrix algebras', 'All of the above'], correctAnswer: 3 },
    { question: "What is the solution to the heat equation on ℝ with initial condition δ(x)?", options: ['e⁻ˣ²', '1/√(4πt) e⁻ˣ²/(4t)', 'sin(x)', 'cos(x)'], correctAnswer: 1 },
    { question: "Which of the following is a Fréchet space?", options: ['C^∞[0,1]', 'ℓ²', 'L²[0,1]', 'ℝⁿ'], correctAnswer: 0 },
    { question: "What is the value of the Legendre symbol (2/7)?", options: ['1', '-1', '0', '2'], correctAnswer: 1 },
    { question: "Which of the following is a perfect number?", options: ['6', '28', '496', 'All of the above'], correctAnswer: 3 },
    { question: "What is the value of the Euler characteristic of a torus?", options: ['0', '1', '2', '-1'], correctAnswer: 0 },
    { question: "Which of the following is a martingale?", options: ['Standard Brownian motion', 'Squared Brownian motion', 'Exponential Brownian motion', 'None'], correctAnswer: 0 },
    { question: "What is the value of the Gaussian curvature of a sphere of radius R?", options: ['0', '1/R', '1/R²', 'R'], correctAnswer: 2 },
    { question: "Which of the following is a solvable group?", options: ['S₃', 'S₄', 'S₅', 'Both A and B'], correctAnswer: 3 },
    { question: "What is the value of the Laplace transform of t?", options: ['1/s', '1/s²', 's', 's²'], correctAnswer: 1 },
    { question: "Which of the following is a regular Sturm-Liouville problem?", options: ["-y'' = λy on (0,π) with y(0)=y(π)=0", "y'' + λy = 0 on (0,1) with y'(0)=y'(1)=0", 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Kronecker delta δᵢⱼ when i≠j?", options: ['0', '1', '-1', 'Undefined'], correctAnswer: 0 },
    { question: "Which of the following is a second-countable space?", options: ['ℝ with standard topology', 'ℝ with discrete topology', 'Uncountable product of ℝ', 'None'], correctAnswer: 0 },
    { question: "What is the value of the Christoffel symbol Γ¹₁₁ for Euclidean metric?", options: ['0', '1', '1/2', 'Undefined'], correctAnswer: 0 },
    { question: "Which of the following is a Radon measure?", options: ['Lebesgue measure', 'Dirac measure', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Pontryagin dual of ℤ?", options: ['ℤ', 'ℝ', 'S¹', 'ℝ/ℤ'], correctAnswer: 2 },
    { question: "Which of the following is a coherent sheaf?", options: ['Structure sheaf on affine scheme', 'Sheaf of holomorphic functions', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Atiyah-Singer index for the Dirac operator on S²?", options: ['0', '1', '2', 'Undefined'], correctAnswer: 0 },
    { question: "Which of the following is a Calabi-Yau manifold?", options: ['Torus', 'K3 surface', 'Quintic threefold', 'All of the above'], correctAnswer: 3 },
    { question: "What is the value of the Jones polynomial of the unknot?", options: ['0', '1', '-1', 't'], correctAnswer: 1 },
    { question: "Which of the following is a modular form of weight 12?", options: ['Eisenstein series E₁₂', 'Delta function Δ', 'Both', 'Neither'], correctAnswer: 1 },
    { question: "What is the value of the class number of ℚ(√-5)?", options: ['1', '2', '3', '4'], correctAnswer: 1 },
    { question: "Which of the following is a Banach algebra?", options: ['C(X) for compact X', 'L¹(ℝ)', 'B(H)', 'All of the above'], correctAnswer: 3 },
    { question: "What is the value of the Wiener measure of continuous paths?", options: ['0', '1', '∞', 'Not defined'], correctAnswer: 1 },
    { question: "Which of the following is a Gδ set in ℝ?", options: ['ℚ', 'ℝ\\ℚ', '[0,1]', 'All singletons'], correctAnswer: 1 },
    { question: "What is the value of the Haar measure of SU(2)?", options: ['0', '1', 'Finite', 'Infinite'], correctAnswer: 2 },
    { question: "Which of the following is a nuclear space?", options: ['Schwartz space', 'ℓ²', 'L²', 'None'], correctAnswer: 0 },
    { question: "What is the value of the Chern class of the tautological line bundle over ℂP¹?", options: ['0', '1', '-1', '2'], correctAnswer: 2 },
    { question: "Which of the following is a tame topology?", options: ['O-minimal structure', 'Zariski topology', 'Standard topology', 'None'], correctAnswer: 0 },
    { question: "What is the value of the Milnor number of f(x,y)=x³+y³?", options: ['1', '2', '4', '9'], correctAnswer: 2 },
    { question: "Which of the following is a perfectoid field?", options: ['ℂₚ', 'ℚₚ', 'ℝ', 'None'], correctAnswer: 0 },
    { question: "What is the value of the Tate-Shafarevich group for an elliptic curve over ℚ (conjecturally)?", options: ['0', 'Finite', 'Infinite', 'Trivial'], correctAnswer: 1 },
    { question: "Which of the following is a Shimura variety?", options: ['Modular curve', 'Hilbert modular variety', 'Siegel modular variety', 'All of the above'], correctAnswer: 3 },
    { question: "What is the value of the Langlands parameter for GL(1)?", options: ['Galois character', 'Automorphic representation', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "Which of the following is a motivic cohomology group?", options: ['H¹(X,ℤ(1))', 'CH¹(X)', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Grothendieck group K₀(𝔽_q)?", options: ['ℤ', 'ℤ/qℤ', '0', 'ℚ'], correctAnswer: 0 },
    { question: "Which of the following is a derived category?", options: ['D(Ab)', 'D(Mod-R)', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Hochschild cohomology HH⁰(A) for algebra A?", options: ['Center of A', 'A', 'Derivations', '0'], correctAnswer: 0 },
    { question: "Which of the following is a stack?", options: ['Moduli of elliptic curves', 'Classifying space BG', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the L-function L(E,1) for elliptic curve E (Birch-Swinnerton-Dyer)?", options: ['0', 'Related to rank', 'Always 1', 'Undefined'], correctAnswer: 1 },
    { question: "Which of the following is a vertex operator algebra?", options: ['Moonshine module', 'Heisenberg VOA', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the central charge of the Ising model?", options: ['1/2', '1', '3/2', '2'], correctAnswer: 0 },
    { question: "Which of the following is a cluster algebra?", options: ['Coordinate ring of Grassmannian', 'Quantum group', 'Both', 'Neither'], correctAnswer: 0 },
    { question: "What is the value of the Donaldson-Thomas invariant for ℂ³?", options: ['0', '1', '-1', '∞'], correctAnswer: 1 },
    { question: "Which of the following is a symplectic manifold?", options: ['Cotangent bundle', 'Kähler manifold', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Maslov index for a loop in Lagrangian Grassmannian?", options: ['0', 'Integer', 'Real', 'Undefined'], correctAnswer: 1 },
    { question: "Which of the following is a Floer homology?", options: ['Symplectic Floer', 'Instanton Floer', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Gromov-Witten invariant for point in ℂP²?", options: ['0', '1', '3', '∞'], correctAnswer: 1 },
    { question: "Which of the following is a perverse sheaf?", options: ['Intersection cohomology complex', 'Constant sheaf', 'Both', 'Neither'], correctAnswer: 0 },
    { question: "What is the value of the Riemann-Roch theorem for curve of genus g?", options: ['deg(D) + 1 - g', 'deg(D) + g - 1', '2g - 2', 'g'], correctAnswer: 0 },
    { question: "Which of the following is a rigid analytic space?", options: ['Berkovich spectrum', 'Adic space', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the p-adic L-function at s=1?", options: ['Related to class number', '0', '1', '∞'], correctAnswer: 0 },
    { question: "Which of the following is a Drinfeld module?", options: ['Function field analogue of elliptic curve', 'p-adic modular form', 'Both', 'Neither'], correctAnswer: 0 },
    { question: "What is the value of the Iwasawa μ-invariant for cyclotomic ℤₚ-extension?", options: ['0 (conjectured)', '1', 'p', '∞'], correctAnswer: 0 },
    { question: "Which of the following is a Langlands parameter?", options: ['Weil-Deligne representation', 'Galois representation', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Arthur-Selberg trace formula for GL(2)?", options: ['Relates spectral and geometric data', '0', '1', 'Undefined'], correctAnswer: 0 },
    { question: "Which of the following is a motive?", options: ['Tate motive', 'Elliptic curve motive', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Beilinson regulator?", options: ['Maps K-theory to Deligne cohomology', '0', '1', '∞'], correctAnswer: 0 },
    { question: "Which of the following is a noncommutative space?", options: ['Spectral triple', 'Quantum group', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Connes-Chern character?", options: ['Maps K-theory to cyclic cohomology', '0', '1', '∞'], correctAnswer: 0 },
    { question: "Which of the following is a topos?", options: ['Category of sheaves', 'Étale topos', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the homotopy groups of spheres πₙ(Sᵐ) for n>m?", options: ['Finite (mostly)', 'Always 0', 'Always ℤ', 'Infinite'], correctAnswer: 0 },
    { question: "Which of the following is a model category?", options: ['Topological spaces', 'Chain complexes', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the Steenrod square Sq¹?", options: ['Bockstein homomorphism', '0', '1', 'Cup product'], correctAnswer: 0 },
    { question: "Which of the following is an E∞-ring spectrum?", options: ['Complex cobordism', 'K-theory', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the chromatic filtration level for Morava K-theory K(n)?", options: ['n', 'n-1', '2n', '∞'], correctAnswer: 0 },
    { question: "Which of the following is a condensed mathematics object?", options: ['Pyknotic set', 'Liquid vector space', 'Both', 'Neither'], correctAnswer: 2 },
    { question: "What is the value of the liquid tensor experiment result?", options: ['Verified in Lean', 'False', 'Open', 'Trivial'], correctAnswer: 0 }
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

    // Set up exit button
    exitBtn.addEventListener('click', exitToMenu);
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

function exitToMenu() {
    if (confirm("Are you sure you want to exit the quiz? Your progress will be lost.")) {
        clearInterval(timerInterval); // Stop the timer
        // Reset to initial state
        difficultyPage.style.display = 'block';
        quizPage.style.display = 'none';
        resultsPage.style.display = 'none';
        
        // Reset selected count button to default
        countButtons.forEach(btn => btn.classList.remove('selected'));
        document.querySelector('.count-btn[data-count="20"]').classList.add('selected');
        questionCount = 20;
    }
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









