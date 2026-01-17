const shapes = ["⬛", "🔵", "⭐", "🔺"]; // Start with 4
const advancedShapes = ["⬛", "🔵", "⭐", "🔺", "🟡", "🟢"]; // Unlock 6
const treasures = ["💎", "🏆", "🌟", "🔑", "🪙", "🎁"];
let currentShapes = shapes;
let pick = [];
let open = [];
let matched = 0;
let score = 0;
let streak = 0;
let timer;
let timeLeft = 20;
let level = 1;
let gridSize = 4; // 4x4 grid

const instruction = document.getElementById("instruction");
const grid = document.getElementById("grid");
const treasuresEl = document.getElementById("treasures");
const scoreEl = document.getElementById("score");
const timerFill = document.getElementById("timer-fill");
const startBtn = document.getElementById("start-btn");
const levelBtn = document.getElementById("level-btn");

// Simple sound effects using Web Audio API
function playSound(frequency, duration, type = 'sine') {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function startGame() {
  score = 0;
  streak = 0;
  matched = 0;
  level = 1;
  currentShapes = shapes;
  gridSize = 4;
  updateScore();
  treasuresEl.innerHTML = "";
  levelBtn.style.display = "none";
  startBtn.textContent = "🔄 Reset Quest";
  nextRound();
}

function nextRound() {
  clearInterval(timer);
  timeLeft = 20;
  timerFill.style.width = "100%";
  grid.innerHTML = "";
  open = [];
  matched = 0;
  pick = [...currentShapes.slice(0, gridSize / 2), ...currentShapes.slice(0, gridSize / 2)].sort(() => Math.random() - 0.5);
  instruction.textContent = `Find matching shapes to uncover treasures! Level ${level}`;

  pick.forEach(s => {
    let d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front">${s}</div>
    `;
    d.setAttribute("aria-label", "Memory card");
    d.onclick = () => flipCard(d, s);
    grid.appendChild(d);
  });

  timer = setInterval(() => {
    timeLeft--;
    timerFill.style.width = (timeLeft / 20) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Quest failed! Storm hit. ❌");
      playSound(200, 0.5);
      nextRound();
    }
  }, 1000);
}

function flipCard(card, shape) {
  if (open.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    open.push({ card, shape });
    playSound(600, 0.2);

    if (open.length === 2) {
      setTimeout(() => checkMatch(), 1000);
    }
  }
}

function checkMatch() {
  const [first, second] = open;
  if (first.shape === second.shape) {
    score += 30;
    streak++;
    matched++;
    first.card.classList.add("match");
    second.card.classList.add("match");
    playSound(800, 0.3);
    revealTreasure();
    if (matched === pick.length / 2) {
      clearInterval(timer);
      if (level < 3) {
        level++;
        currentShapes = advancedShapes;
        gridSize = 6; // Larger grid
        levelBtn.style.display = "inline";
        alert(`Quest complete! 🏴‍☠️ Treasures found. Shape fact: ${getShapeFact(first.shape)}`);
      } else {
        alert("Legendary treasure hunter! 🏆");
      }
    }
  } else {
    streak = 0;
    first.card.classList.add("mismatch");
    second.card.classList.add("mismatch");
    playSound(300, 0.5);
    setTimeout(() => {
      first.card.classList.remove("flipped", "mismatch");
      second.card.classList.remove("flipped", "mismatch");
    }, 500);
  }
  open = [];
  updateScore();
}

function revealTreasure() {
  let t = document.createElement("div");
  t.className = "treasure";
  t.textContent = treasures[matched - 1] || "🎉";
  treasuresEl.appendChild(t);
  setTimeout(() => t.classList.add("revealed"), 100);
}

function updateScore() {
  scoreEl.textContent = `Score: ${score} | Streak: ${streak} | Treasures: ${matched}`;
}

function nextLevel() {
  levelBtn.style.display = "none";
  nextRound();
}

function getShapeFact(shape) {
  const facts = {
    "⬛": "Square has 4 equal sides.",
    "🔵": "Circle has no corners.",
    "⭐": "Star has 5 points.",
    "🔺": "Triangle has 3 sides.",
    "🟡": "Yellow circle is bright!",
    "🟢": "Green square is cool."
  };
  return facts[shape] || "A fun shape!";
}