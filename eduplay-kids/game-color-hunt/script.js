const colors = [
  { name: "Red / Rojo", value: "red" },
  { name: "Blue / Azul", value: "blue" },
  { name: "Green / Verde", value: "green" },
  { name: "Yellow / Amarillo", value: "yellow" },
  { name: "Purple / Morado", value: "purple" }
];
const advancedColors = [
  ...colors,
  { name: "Orange / Naranja", value: "orange" },
  { name: "Pink / Rosa", value: "pink" },
  { name: "Brown / Marrón", value: "brown" }
];

let currentColors = colors;
let score = 0;
let streak = 0;
let timer;
let timeLeft = 10; // Seconds per round
let level = 1;

const target = document.getElementById("target");
const area = document.getElementById("colors");
const scoreEl = document.getElementById("score");
const timerFill = document.getElementById("timer-fill");
const startBtn = document.getElementById("start-btn");
const levelBtn = document.getElementById("level-btn");

// Simple sound effects using Web Audio API
function playSound(frequency, duration) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function startGame() {
  score = 0;
  streak = 0;
  level = 1;
  currentColors = colors;
  updateScore();
  levelBtn.style.display = "none";
  startBtn.textContent = "🔄 Reset";
  nextRound();
}

function nextRound() {
  clearInterval(timer);
  timeLeft = 10;
  timerFill.style.width = "100%";
  area.innerHTML = "";
  let pick = currentColors[Math.floor(Math.random() * currentColors.length)];
  target.textContent = "Find: " + pick.name;

  currentColors.sort(() => Math.random() - 0.5).forEach(c => {
    let d = document.createElement("div");
    d.className = "box";
    d.style.background = c.value;
    d.setAttribute("aria-label", c.name);
    d.onclick = () => checkAnswer(c, pick, d);
    area.appendChild(d);
  });

  timer = setInterval(() => {
    timeLeft--;
    timerFill.style.width = (timeLeft / 10) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! ❌ Try again.");
      playSound(200, 0.5); // Low tone for fail
      nextRound();
    }
  }, 1000);
}

function checkAnswer(selected, correct, element) {
  clearInterval(timer);
  if (selected.value === correct.value) {
    score += 10;
    streak++;
    element.classList.add("correct");
    playSound(800, 0.3); // High tone for success
    setTimeout(() => {
      if (streak % 3 === 0 && level < 2) {
        level++;
        currentColors = advancedColors;
        levelBtn.style.display = "inline";
        alert("Level up! 🌟 New colors unlocked.");
      } else {
        nextRound();
      }
    }, 1000);
  } else {
    streak = 0;
    element.classList.add("incorrect");
    playSound(300, 0.5); // Mid tone for wrong
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