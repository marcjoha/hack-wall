import '@picocss/pico/css/pico.min.css'
import './style.css'
import { SoundManager } from './audio';
import { CustomSelect } from './ui/CustomSelect';
import { parseDuration, parseAbsoluteTime } from './utils/time';
import { Timer } from './core/Timer';
import { MatrixEffect } from './effects/MatrixEffect';
import { StarfieldEffect } from './effects/StarfieldEffect';

// --- DOM Elements ---
const configForm = document.getElementById('config-form') as HTMLFormElement;
const configScreen = document.getElementById('config-screen') as HTMLElement;
const wallScreen = document.getElementById('wall-screen') as HTMLElement;
const bgLayer = document.getElementById('bg-layer') as HTMLElement;
const displayMission = document.getElementById('display-mission') as HTMLElement;
const timerDisplay = document.getElementById('timer') as HTMLElement;
const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;

const endTimeInput = document.getElementById('end-time') as HTMLInputElement;
const durationInput = document.getElementById('duration') as HTMLSelectElement;
const bgStyleSelect = document.getElementById('bg-style') as HTMLSelectElement;
const soundStyleSelect = document.getElementById('sound-style') as HTMLSelectElement;

// --- Initialization ---
const soundManager = new SoundManager();
const timer = new Timer();
const matrixEffect = new MatrixEffect(canvas);
const starfieldEffect = new StarfieldEffect(canvas);

// --- Background Management ---
function stopAllEffects() {
  matrixEffect.stop();
  starfieldEffect.stop();
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateBackground(style: string) {
  bgLayer.className = '';
  bgLayer.classList.add(style);

  stopAllEffects();

  if (style === 'matrix') {
    matrixEffect.start();
  } else if (style === 'starfield') {
    starfieldEffect.start();
  }
}

// Window resize handling
window.addEventListener('resize', () => {
  matrixEffect.resize();
  starfieldEffect.resize();
});

// --- UI Logic ---

// Mutually exclusive inputs
endTimeInput.addEventListener('input', () => {
  if (endTimeInput.value) {
    durationInput.value = '';
    durationInput.dispatchEvent(new Event('change'));
  }
});

durationInput.addEventListener('change', () => {
  if (durationInput.value) endTimeInput.value = '';
});

// Initialize Custom Selects
new CustomSelect(document.getElementById("duration") as HTMLSelectElement);
new CustomSelect(document.getElementById("bg-style") as HTMLSelectElement);
new CustomSelect(document.getElementById("sound-style") as HTMLSelectElement);


bgStyleSelect.addEventListener('change', () => {
  updateBackground(bgStyleSelect.value);
});

soundStyleSelect.addEventListener('change', () => {
  soundManager.playTheme(soundStyleSelect.value);
});

// --- Form Submission ---
configForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(configForm);
  const mission = formData.get('mission') as string;
  const endTimeStr = formData.get('end-time') as string;
  const durationStr = formData.get('duration') as string;
  const soundStyle = formData.get('sound-style') as string;

  let targetMs: number;

  if (durationStr) {
    const ms = parseDuration(durationStr);
    if (ms !== null) {
      targetMs = Date.now() + ms;
    } else {
      alert("Invalid duration format. Try '4h' or '30 mins'.");
      return;
    }
  } else if (endTimeStr) {
    targetMs = parseAbsoluteTime(endTimeStr);
  } else {
    alert("Please specify either an end time or a time window.");
    return;
  }

  // Apply Config
  displayMission.textContent = mission;

  timer.start(targetMs, (display, isEnding) => {
    timerDisplay.innerHTML = display;
    timerDisplay.style.color = isEnding ? "#ef4444" : "white";
  });

  // Play Sound
  soundManager.playTheme(soundStyle);

  // Clear focus
  (document.activeElement as HTMLElement)?.blur();

  // Switch Screens
  configScreen.classList.remove('active');
  wallScreen.classList.add('active');
});

// --- Keyboard Controls ---
function cycleOptions(select: HTMLSelectElement, direction: number) {
  const currentIndex = select.selectedIndex;
  const count = select.options.length;
  let newIndex = currentIndex + direction;

  if (newIndex < 0) newIndex = count - 1;
  if (newIndex >= count) newIndex = 0;

  select.selectedIndex = newIndex;
  select.dispatchEvent(new Event('change'));
}

window.addEventListener('keydown', (e) => {
  if (!wallScreen.classList.contains('active')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopImmediatePropagation();
    wallScreen.classList.remove('active');
    configScreen.classList.add('active');

    timer.stop();
    soundManager.stop();
  } else if (e.key === 'ArrowRight') {
    cycleOptions(bgStyleSelect, 1);
  } else if (e.key === 'ArrowLeft') {
    cycleOptions(bgStyleSelect, -1);
  } else if (e.key === 'ArrowUp') {
    cycleOptions(soundStyleSelect, -1);
  } else if (e.key === 'ArrowDown') {
    cycleOptions(soundStyleSelect, 1);
  }
}, { capture: true });

// --- Initial Setup ---

// Set default time (2 hours from now)
const now = new Date();
now.setHours(now.getHours() + 2);
const defaultTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
endTimeInput.value = defaultTime;

// Initialize background
updateBackground(bgStyleSelect.value);

// Remove preload class
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.remove('preload');
  }, 100);
});
