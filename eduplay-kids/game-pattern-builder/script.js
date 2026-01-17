const items = ["🔴", "🔵"]; // Start with basic
const advancedItems = ["🔴", "🔵", "🟡", "🟢"]; // Unlock more
let currentItems = items;
let pattern = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let timer;
let timeLeft = 10;
let level = 1;

const patternEl = document.getElementById("pattern");
const mosaic = document.getElementById("mosaic");
const optionsEl = document.getElementById("options");
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
  level = 1;
  currentItems = items;
  updateScore();
  mosaic.innerHTML = "";
  levelBtn.style.display = "none";
  startBtn.textContent = "🔄 Reset";
  nextRound();
}

function nextRound() {
  clearInterval(timer);
  timeLeft = 10;
  timerFill.style.width = "100%";
  optionsEl.innerHTML = "";
  currentIndex = 0;
  // Generate pattern: e.g., ABAB for level 1
  pattern = generatePattern();
  displayPattern();
  createOptions();

  timer = setInterval(() => {
    timeLeft--;
    timerFill.style.width = (timeLeft / 10) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Mosaic cracked! Time's up. ❌");
      playSound(200, 0.5);
      nextRound();
    }
  }, 1000);
}

function generatePattern() {
  const length = 4 + level; // Longer patterns per level
  const pat = [];
  for (let i = 0; i < length; i++) {
    pat.push(currentItems[i % currentItems.length]);
  }
  return pat;
}

function displayPattern() {
  mosaic.innerHTML = "";
  pattern.forEach((item, index) => {
    let tile = document.createElement("div");
    tile.className = "tile";
    if (index < currentIndex) {
      tile.classList.add("filled");
      tile.textContent = item;
    }
    mosaic.appendChild(tile);
  });
  patternEl.textContent = `Complete the pattern: ${pattern.slice(0, currentIndex).join(" ")} ?`;
}

function createOptions() {
  currentItems.forEach(i => {
    let s = document.createElement("div");
    s.className = "option";
    s.textContent = i;
    s.setAttribute("aria-label", `Option ${i}`);
    s.onclick = () => checkAnswer(i, s);
    optionsEl.appendChild(s);
  });
}

function checkAnswer(selected, element) {
  if (selected === pattern[currentIndex]) {
    score += 25;
    streak++;
    element.classList.add("correct");
    playSound(800, 0.3);
    currentIndex++;
    displayPattern();
    if (currentIndex >= pattern.length) {
      clearInterval(timer);
      if (level < 3) {
        level++;
        currentItems = advancedItems; // Unlock more colors
        levelBtn.style.display = "inline";
        alert(`Mosaic complete! 🌈 Level up. Pattern rule: Repeating every ${currentItems.length} items.`);
      } else {
        alert("Master mosaic builder! 🎨");
      }
    }
  } else {
    streak = 0;
    element.classList.add("incorrect");
    playSound(300, 0.5);
    mosaic.style.animation = "crack 0.5s";
    setTimeout(() => mosaic.style.animation = "", 500);
    setTimeout(() => nextRound(), 1000);
  }
  updateScore();
}

function updateScore() {
  scoreEl.textContent = `Score: ${score} | Streak: ${streak}`;
}

function nextLevel() {
  levelBtn.style.display = "none";
  nextRound();
}