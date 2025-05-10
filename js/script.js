const shapeSelector = document.getElementById('shapeSelector');
const colorPickers = document.getElementById('colorPickers');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const addStripe = document.getElementById('addStripe');

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
  }
}

// UI setup
shapeSelector.addEventListener('change', updateCanvas);
colorPickers.addEventListener('input', updateCanvas);
addStripe.addEventListener('click', () => {
  const label = document.createElement('label');
  label.innerHTML = `Color ${colorPickers.children.length + 1}: <input type="color" value="#ffffff">`;
  colorPickers.appendChild(label);
  updateCanvas();
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'emoji.png';
  link.href = canvas.toDataURL();
  link.click();
});

const presets = {
  rainbow: ['#E50D00', '#FC8E03', '#FFEE00', '#22821B', '#024AFF', '#78118A'],
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
  const stripeHeight = height / colors.length;

  ctx.save();
  ctx.beginPath();
  drawShape(ctx); // define shape path
  ctx.clip();

  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, yStart + i * stripeHeight, canvas.width, stripeHeight);
  });

  ctx.restore();
}

updateCanvas();
