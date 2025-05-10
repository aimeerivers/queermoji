const shapeSelector = document.getElementById('shapeSelector');
const colorPickers = document.getElementById('colorPickers');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const addStripe = document.getElementById('addStripe');
const removeStripe = document.getElementById('removeStripe');

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

function squarePath(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(128, 0);
  ctx.lineTo(128, 128);
  ctx.lineTo(0, 128);
  ctx.lineTo(0, 0);
  ctx.closePath();
}

function rectanglePath(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(128, 18);
  ctx.lineTo(128, 110);
  ctx.lineTo(0, 110);
  ctx.lineTo(0, 18);
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
  const colors = [...colorPickers.querySelectorAll('input')].map(el => el.value);

  if (shape === 'heart') {
    fillShapeWithStripes(ctx, heartPath, colors, 9, 120);
  } else if (shape === 'star') {
    fillShapeWithStripes(ctx, starPath, colors, 2, 126);
  } else if (shape === 'square') {
    fillShapeWithStripes(ctx, squarePath, colors, 0, 128);
  } else if (shape === 'rectangle') {
    fillShapeWithStripes(ctx, rectanglePath, colors, 18, 110);
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
  const label = document.createElement('label');
  label.innerHTML = `Color ${colorPickers.children.length + 1}: <input type="color" value="#ffffff">`;
  colorPickers.appendChild(label);
  removeStripe.disabled = false;
  updateCanvas();
});
removeStripe.addEventListener('click', () => {
  if (colorPickers.children.length > 1) {
    colorPickers.removeChild(colorPickers.lastChild);
  }
  if (colorPickers.children.length === 1) {
    removeStripe.disabled = true;
  }
  updateCanvas();
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `${shapeSelector.value}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

const presets = {
  pride: ['#E50D00', '#FC8E03', '#FFEE00', '#22821B', '#024AFF', '#78118A'],
  bi: ['#D61370', '#D61370', '#9B4F96', '#0138A8', '#0138A8'],
  trans: ['#5ACFFA', '#F5ABBA', '#FFFFFF', '#F5ABBA', '#5ACFFA'],
  nonbinary: ['#FFF530', '#FFFFFF', '#9D59D1', '#282828']
};

document.querySelectorAll('#presets button').forEach(btn => {
  btn.addEventListener('click', () => {
    const flag = btn.dataset.flag;
    const colors = presets[flag];

    colorPickers.innerHTML = ''; // Clear existing
    colors.forEach((color, i) => {
      const label = document.createElement('label');
      label.innerHTML = `Color ${i + 1}: <input type="color" value="${color}">`;
      colorPickers.appendChild(label);
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

updateCanvas();
