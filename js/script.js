const shapeSelector = document.getElementById('shapeSelector');
const colorPickers = document.getElementById('colorPickers');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const addStripe = document.getElementById('addStripe');

let preset = null;

// Utility: make vertical gradient
function makeVerticalGradient(ctx, colors) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  colors.forEach((c, i) => {
    gradient.addColorStop(i / (colors.length - 1), c);
  });
  return gradient;
}

function heartPath(ctx) {
  ctx.beginPath();
  ctx.moveTo(64, 25);
  ctx.bezierCurveTo(60, 1, 0, 1, 0, 44);
  ctx.bezierCurveTo(1, 80, 60, 120, 64, 120);
  ctx.bezierCurveTo(68, 120, 128, 80, 128, 44);
  ctx.bezierCurveTo(128, 1, 68, 1, 64, 25);
  ctx.closePath();
}

function flagPath(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(128, 18);
  ctx.lineTo(128, 110);
  ctx.lineTo(0, 110);
  ctx.lineTo(0, 18);
  ctx.closePath();
}

function squarePath(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(128, 0);
  ctx.lineTo(128, 128);
  ctx.lineTo(0, 128);
  ctx.lineTo(0, 0);
  ctx.closePath();
}

function circlePath(ctx) {
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.closePath();
}

function eggPath(ctx) {
  ctx.beginPath();
  ctx.moveTo(64, 0);
  ctx.bezierCurveTo(40, 0, 18, 30, 16, 80);
  ctx.bezierCurveTo(16, 100, 32, 128, 64, 128);
  ctx.bezierCurveTo(96, 128, 112, 100, 112, 80);
  ctx.bezierCurveTo(110, 30, 88, 0, 64, 0);
  ctx.closePath();
}

function starPath(ctx) {
  const cx = 64;
  const cy = 70;
  const spikes = 5;
  const outerRadius = 68;
  const innerRadius = 32;
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.closePath();
}

// Main draw handler
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.imageSmoothingEnabled = true;

  const shape = shapeSelector.value;
  const colors = [...colorPickers.querySelectorAll('input[type=text]')].map(el => el.value);

  if (shape === 'heart') {
    fillShapeWithStripes(ctx, heartPath, colors, 9, 120);
  } else if (shape === 'star') {
    fillShapeWithStripes(ctx, starPath, colors, 2, 126);
  } else if (shape === 'flag') {
    fillShapeWithStripes(ctx, flagPath, colors, 18, 110);
  } else if (shape === 'square') {
    fillShapeWithStripes(ctx, squarePath, colors, 0, 128);
  } else if (shape === 'circle') {
    fillShapeWithStripes(ctx, circlePath, colors, 0, 128);
  } else if (shape === 'egg') {
    fillShapeWithStripes(ctx, eggPath, colors, 0, 130);
  }
}

// UI setup
shapeSelector.addEventListener('change', updateCanvas);
colorPickers.addEventListener('input', updateCanvas);

addStripe.addEventListener('click', () => {
  addColorInput();
  preset = null;
  updateCanvas();
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  const filename = `${preset ? preset + "_" : ""}${shapeSelector.value}.png`;
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
});

const presets = {
  pride: ['#E50D00', '#FC8E03', '#FFEE00', '#22821B', '#024AFF', '#78118A'],
  queer: ['#000000', '#9ad9ea', '#0da3e7', '#b5e51e', '#ffffff', '#ffca0e', '#fb6567', '#fbaec9', '#000000'],
  gay: ['#218e71', '#99e8c3', '#ffffff', '#7baee3', '#3a1379'],
  lesbian: ['#d62901', '#fc9b55', '#ffffff', '#d462a6', '#a50d62'],
  bi: ['#D61370', '#D61370', '#9B4F96', '#0138A8', '#0138A8'],
  pan: ['#f91c8e', '#ffd902', '#1bb3ff'],
  ace: ['#000000', '#a4a4a4', '#FFFFFF', '#811081'],
  aroace: ['#e38e00', '#edce00', '#FFFFFF', '#62afdd', '#1a3555'],
  trans: ['#5ACFFA', '#F5ABBA', '#FFFFFF', '#F5ABBA', '#5ACFFA'],
  genderqueer: ['#b77fdd', '#FFFFFF', '#48821d'],
  nonbinary: ['#FFF530', '#FFFFFF', '#9D59D1', '#282828']
};

document.querySelectorAll('#presets button').forEach(btn => {
  btn.addEventListener('click', () => {
    const flag = btn.dataset.flag;
    const colors = presets[flag];
    preset = flag;

    colorPickers.innerHTML = ''; // Clear existing
    colors.forEach((color) => {
      addColorInput(color);
    });

    updateCanvas();
  });
});

function fillShapeWithStripes(ctx, drawShape, colors, yStart = 20, yEnd = 100) {
  const height = yEnd - yStart;
  const stripeCount = colors.length;
  const baseHeight = Math.floor(height / stripeCount);
  const remainder = height - baseHeight * stripeCount; // leftover pixels

  ctx.save();
  ctx.beginPath();
  drawShape(ctx);
  ctx.clip();

  let currentY = yStart;
  colors.forEach((color, i) => {
    const stripeHeight = baseHeight + (i === stripeCount - 1 ? remainder : 0);
    ctx.fillStyle = color;
    ctx.fillRect(0, currentY, canvas.width, stripeHeight + 1); // slight overlap
    currentY += stripeHeight;
  });

  ctx.restore();
}

function addColorInput(color = '#ff0000') {
  const colorList = document.getElementById('colorPickers');

  const row = document.createElement('div');
  row.className = 'color-row';

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = color;

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.value = color;
  textInput.maxLength = 7;

  // Keep them in sync
  colorInput.addEventListener('input', () => {
    textInput.value = colorInput.value;
    render(); // update the canvas if needed
  });

  textInput.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(textInput.value)) {
      colorInput.value = textInput.value;
      render();
    }
  });

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '✕';
  removeBtn.style.border = 'none';
  removeBtn.style.cursor = 'pointer';
  removeBtn.addEventListener('click', () => {
    row.remove();
    updateCanvas();
  });

  row.appendChild(colorInput);
  row.appendChild(textInput);
  row.appendChild(removeBtn);
  colorList.appendChild(row);
}

addColorInput("#ff69b4");
addColorInput("#9b4de0");
addColorInput("#1e90ff");

updateCanvas();
