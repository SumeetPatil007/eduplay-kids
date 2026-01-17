const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const vowels = "AEIOU".split("");
let currentLetters = vowels; // Start with vowels for easier learning
let score = 0;
let streak = 0;
let timer;
let timeLeft = 12; // Slightly longer for letters
let level = 1;

const target = document.getElementById("letter");
const box = document.getElementById("letters");
const scoreEl = document.getElementById("score");
const timerFill = document.getElementById("timer-fill");
const startBtn = document.getElementById("start-btn");
const levelBtn = document.getElementById("level-btn");

// Simple sound effects and letter pronunciation using Web Audio API
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

function pronounceLetter(letter) {
  // Basic phonics: Approximate sounds (expand with real audio if needed)
  const sounds = {
    A: 440, B: 494, C: 523, D: 587, E: 659, F: 698, G: 784, H: 880, I: 988, J: 1047, K: 1175, L: 1319, M: 1397, N: 1568, O: 1760, P: 1976, Q: 2093, R: 2349, S: 2637, T: 2794, U: 3136, V: 3322, W: 3520, X: 3729, Y: 3951, Z: 4186
  };
  playSound(sounds[letter] || 440, 0.5, 'triangle');
}

function startGame() {
  score = 0;
  streak = 0;
  level = 1;
  currentLetters = vowels;
  updateScore();
  levelBtn.style.display = "none";
  startBtn.textContent = "🔄 Reset";
  nextRound();
}

function nextRound() {
  clearInterval(timer);
  timeLeft = 12;
  timerFill.style.width = "100%";
  box.innerHTML = "";
  let pick = currentLetters[Math.floor(Math.random() * currentLetters.length)];
  target.textContent = `Pop: ${pick} (Sound: ${pick} / ${getSpanishSound(pick)})`;

  currentLetters.sort(() => Math.random() - 0.5).slice(0, 8).forEach(l => { // More bubbles for challenge
    let s = document.createElement("span");
    s.className = "bubble";
    s.textContent = l;
    s.style.background = `radial-gradient(circle, ${getRandomColor()}, rgba(255,255,255,0.5))`; // Random bubble colors
    s.setAttribute("aria-label", `Letter ${l}`);
    s.onclick = () => checkAnswer(l, pick, s);
    box.appendChild(s);
  });

  timer = setInterval(() => {
    timeLeft--;
    timerFill.style.width = (timeLeft / 12) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Pop again. ❌");
      playSound(200, 0.5);
      nextRound();
    }
  }, 1000);
}

function checkAnswer(selected, correct, element) {
  clearInterval(timer);
  pronounceLetter(selected); // Play sound on click
  if (selected === correct) {
    score += 15;
    streak++;
    element.classList.add("pop-correct");
    playSound(800, 0.3);
    setTimeout(() => {
      if (streak % 4 === 0 && level < 2) {
        level++;
        currentLetters = alpha; // Unlock full alphabet
        levelBtn.style.display = "inline";
        alert("Level up! 🌟 Full alphabet unlocked. Form words!");
      } else {
        nextRound();
      }
    }, 1000);
  } else {
    streak = 0;
    element.classList.add("pop-incorrect");
    playSound(300, 0.5);
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

function getRandomColor() {
  const colors = ["#ffeb3b", "#4caf50", "#2196f3", "#ff5722", "#9c27b0", "#00bcd4"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getSpanishSound(letter) {
  // Basic Spanish phonics hints (approximate)
  const hints = { A: "Ah", E: "Eh", I: "Ee", O: "Oh", U: "Oo" };
  return hints[letter] || letter.toLowerCase();
}