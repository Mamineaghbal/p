// ====== Setup ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI Elements
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const exitBtn = document.getElementById("exitBtn");

// Ball
let ballX, ballY, ballRadius = 16, dx, dy;

// Paddle
const paddleHeight = 30;
const paddleWidth = 150;
let paddleX;

// Controls
let rightPressed = false;
let leftPressed = false;

// Lives & Score
let lives, score;

// Stage info
let stage, gameRunning;
const maxStage = 3;
const stages = [
  { rows: 3, cols: 5 },
  { rows: 4, cols: 7 },
  { rows: 5, cols: 9 }
];
const stageColors = ["#2a9d8f", "#e76f51", "#f4a261"];
const stageBackgrounds = ["#f0f8ff", "#ffe5d4", "#fff2e6"]; // stage backgrounds

// Bricks
let brickRowCount, brickColumnCount, brickWidth, brickHeight;
const brickPadding = 20, brickOffsetTop = 40;
let brickOffsetLeftDynamic;
let bricks = [];

// ====== Controls ======
document.addEventListener("keydown", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// ====== Game Setup ======
function setupStage(stageNum) {
  const { rows, cols } = stages[stageNum - 1];
  brickRowCount = rows;
  brickColumnCount = cols;

  // Dynamic sizing to fit canvas
  brickWidth = (canvas.width - 2 * 30 - (brickColumnCount - 1) * brickPadding) / brickColumnCount;
  brickHeight = 40;
  brickOffsetLeftDynamic = (canvas.width - (brickColumnCount * brickWidth + (brickColumnCount - 1) * brickPadding)) / 2;

  // Initialize bricks
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  // Ball & Paddle
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  dx = 3;
  dy = -3;
  paddleX = (canvas.width - paddleWidth) / 2;

  // Game state
  score = 0;
  gameRunning = true;
}

// ====== Drawing Functions ======
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = stageColors[stage - 1];
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeftDynamic;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = stageColors[stage - 1];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawMessage(text, color = "purple") {
  ctx.font = "32px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// ====== Retry / Exit ======
function showRetryExit() {
  retryBtn.style.display = "block";
  exitBtn.style.display = "block";

  retryBtn.onclick = () => {
    retryBtn.style.display = "none";
    exitBtn.style.display = "none";
    lives = 3;
    stage = 1;
    setupStage(stage);
  };

  exitBtn.onclick = () => {
    retryBtn.style.display = "none";
    exitBtn.style.display = "none";
    canvas.style.display = "none";
    menu.style.display = "flex";
  };
}

// ====== Collision Detection with improved paddle bounce ======
function collisionDetection() {
  // Brick collisions
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1 &&
          ballX + ballRadius > b.x &&
          ballX - ballRadius < b.x + brickWidth &&
          ballY + ballRadius > b.y &&
          ballY - ballRadius < b.y + brickHeight) {
        dy = -dy; // vertical bounce
        b.status = 0;
        score++;

        if (score === brickRowCount * brickColumnCount) {
          if (stage < maxStage) {
            stage++;
            setupStage(stage);
          } else {
            // Final stage cleared
            gameRunning = false;
            drawWinScreen();
            showRetryExit();
          }
        }
      }
    }
  }

  // Paddle collision with angle
  if (ballY + ballRadius > canvas.height - paddleHeight) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      const collidePoint = ballX - (paddleX + paddleWidth / 2);
      const normalized = collidePoint / (paddleWidth / 2);
      const maxAngle = Math.PI / 3;
      const angle = normalized * maxAngle;
      const speed = Math.sqrt(dx * dx + dy * dy);
      dx = speed * Math.sin(angle);
      dy = -speed * Math.cos(angle);
    }
  }
}

// ====== Draw Win Screen ======
function drawWinScreen() {
  ctx.fillStyle = "#FFD700"; // Gold background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMessage("YOU WIN 🎉", "#000");
}

// ====== Main Loop ======
function draw() {
  if (gameRunning) {
    // Stage background
    ctx.fillStyle = stageBackgrounds[stage - 1];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();

  if (gameRunning) {
    ballX += dx;
    ballY += dy;

    // Wall collisions
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) dx = -dx;
    if (ballY - ballRadius < 0) dy = -dy;
    if (ballY + ballRadius > canvas.height) {
      lives--;
      if (lives <= 0) {
        gameRunning = false;
        ctx.fillStyle = "#FF6347"; // Red background for Game Over
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawMessage("GAME OVER 💀", "#fff");
        showRetryExit();
      } else {
        // Reset ball & paddle
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }

    collisionDetection();

    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
    if (leftPressed && paddleX > 0) paddleX -= 5;
  }

  requestAnimationFrame(draw);
}

// ====== Start Game Button ======
startBtn.onclick = () => {
  menu.style.display = "none";
  canvas.style.display = "block";
  retryBtn.style.display = "none";
  exitBtn.style.display = "none";
  lives = 3;
  stage = 1;
  setupStage(stage);
};

// ====== Start Loop ======
draw();
