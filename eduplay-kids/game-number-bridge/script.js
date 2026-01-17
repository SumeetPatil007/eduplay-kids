let current = 1;
let maxNum = 5; // Start with 1-5
let score = 0;
let streak = 0;
let timer;
let timeLeft = 15; // More time for building
let level = 1;

const instruction = document.getElementById("instruction");
const box = document.getElementById("nums");
const bridge = document.getElementById("bridge");
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

function countSound(num) {
  // Play ascending tones for counting
  for (let i = 0; i < num; i++) {
    setTimeout(() => playSound(400 + (i * 50), 0.2), i * 200);
  }
}

function startGame() {
  score = 0;
  streak = 0;
  level = 1;
  maxNum = 5;
  current = 1;
  updateScore();
  bridge.innerHTML = "";
  levelBtn.style.display = "none";
  startBtn.textContent = "🔄 Reset";
  nextRound();
}

function nextRound() {
  clearInterval(timer);
  timeLeft = 15;
  timerFill.style.width = "100%";
  box.innerHTML = "";
  instruction.textContent = `Build the bridge: Tap ${current} next!`;

  // Create shuffled number buttons
  const nums = Array.from({ length: maxNum }, (_, i) => i + 1);
  nums.sort(() => Math.random() - 0.5).forEach(n => {
    let b = document.createElement("button");
    b.className = "num-btn";
    b.textContent = n;
    b.setAttribute("aria-label", `Number ${n}`);
    b.onclick = () => checkAnswer(n, b);
    box.appendChild(b);
  });

  timer = setInterval(() => {
    timeLeft--;
    timerFill.style.width = (timeLeft / 15) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Bridge collapsed! Time's up. ❌");
      playSound(200, 0.5);
      nextRound();
    }
  }, 1000);
}

function checkAnswer(n, button) {
  if (n === current) {
    score += 20;
    streak++;
    button.classList.add("correct");
    playSound(800, 0.3);
    countSound(current); // Play counting sound
    placeStone(current);
    current++;
    if (current > maxNum) {
      clearInterval(timer);
      if (level < 3) {
        level++;
        maxNum += 5; // Unlock 1-10, then 1-15, etc.
        levelBtn.style.display = "inline";
        alert(`Bridge complete! 🌉 Level up to 1-${maxNum}. Math quiz: What is ${maxNum - 1} + 1?`);
      } else {
        alert("You built the ultimate bridge! 🎉");
      }
    } else {
      instruction.textContent = `Great! Now tap ${current}.`;
    }
  } else {
    streak = 0;
    button.classList.add("incorrect");
    playSound(300, 0.5);
    // Shake the bridge
    bridge.style.animation = "shake 0.5s";
    setTimeout(() => bridge.style.animation = "", 500);
    setTimeout(() => nextRound(), 1000);
  }
  updateScore();
}

function placeStone(num) {
  let stone = document.createElement("div");
  stone.className = "stone";
  stone.textContent = num;
  bridge.appendChild(stone);
  setTimeout(() => stone.classList.add("placed"), 100); // Animate placement
}

function updateScore() {
  scoreEl.textContent = `Score: ${score} | Streak: ${streak}`;
}

function nextLevel() {
  levelBtn.style.display = "none";
  current = 1;
  nextRound();
}