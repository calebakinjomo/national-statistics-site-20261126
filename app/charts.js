// Canvas charts for the Meridia statistics portal. No libraries: every chart is
// drawn by hand on a <canvas> so the site needs no network at all.

const FONT = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
const GRID = '#e3e8ee';
const AXIS = '#5b6b7c';
const BLUE = '#14558f';
const TEAL = '#0e7c6b';
const GOLD = '#b7791f';
const RED = '#b3372f';

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(280, Math.floor(rect.width));
  const height = Math.floor(canvas.dataset.height || 260);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

// Rounds a value up to a "nice" axis maximum: 1, 2, 2.5, 5 or 10 times a
// power of ten, so chart gridlines land on readable numbers. A zero or
// non-positive input (an all-zero series) has no log10, so it falls back
// to 1 instead of producing NaN ticks.
function niceMax(value) {
  if (!(value > 0) || !Number.isFinite(value)) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const scaled = value / power;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 2.5 ? 2.5 : scaled <= 5 ? 5 : 10;
  return step * power;
}

function niceTicks(max, count) {
  const step = niceMax(max) / count;
  const ticks = [];
  for (let i = 0; i <= count; i++) ticks.push(step * i);
  return ticks;
}

function attachTooltip(canvas, points, formatLabel) {
  let tip = canvas.parentElement.querySelector('.chart-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.setAttribute('role', 'status');
    canvas.parentElement.appendChild(tip);
  }
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    let best = null;
    let bestDist = Infinity;
    for (const p of points) {
      const d = Math.abs(p.x - x);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    if (best && bestDist < 40) {
      tip.textContent = formatLabel(best);
      tip.style.display = 'block';
      tip.style.left = Math.min(Math.max(best.x - 60, 0), rect.width - 130) + 'px';
      tip.style.top = Math.max(best.y - 44, 0) + 'px';
    } else {
      tip.style.display = 'none';
    }
  });
  canvas.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
}

// A line chart with labelled axes, gridlines and a hover tooltip.
// series: [{label, values, color}], years: number[], format: value -> string.
export function lineChart(canvas, years, series, format) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padL = 52;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const all = series.flatMap((s) => s.values);
  const min = Math.min(0, ...all);
  const max = Math.max(...all);
  const span = (max - min) || 1;
  const top = max + span * 0.08;
  // With all values at or above zero the axis starts at zero, so no
  // negative-looking tick ever appears; with negative values (growth
  // in 2020) the ticks step down below zero instead.
  const bottom = min >= 0 ? 0 : min - span * 0.05;
  const y = (v) => padT + plotH - ((v - bottom) / (top - bottom)) * plotH;
  const x = (i) => padL + (i / (years.length - 1)) * plotW;

  ctx.font = FONT;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const step = niceMax(min >= 0 ? top : span) / 4;
  const firstTick = min >= 0 ? 0 : Math.floor(bottom / step) * step;
  for (let t = firstTick; t <= top; t += step) {
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(padL, y(t));
    ctx.lineTo(width - padR, y(t));
    ctx.stroke();
    ctx.fillStyle = AXIS;
    ctx.fillText(format(t), padL - 8, y(t));
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i < years.length; i++) {
    if (i % 2 === 0 || i === years.length - 1) {
      ctx.fillStyle = AXIS;
      ctx.fillText(String(years[i]), x(i), height - padB + 8);
    }
  }

  const points = [];
  for (const s of series) {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    s.values.forEach((v, i) => {
      if (i === 0) ctx.moveTo(x(i), y(v));
      else ctx.lineTo(x(i), y(v));
    });
    ctx.stroke();
    ctx.fillStyle = s.color;
    s.values.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(x(i), y(v), 3.5, 0, Math.PI * 2);
      ctx.fill();
      points.push({ x: x(i), y: y(v), year: years[i], label: s.label, value: v });
    });
  }
  attachTooltip(canvas, points, (p) => `${p.label} · ${p.year}: ${format(p.value)}`);
}

// A vertical bar chart with value labels and a hover tooltip.
export function barChart(canvas, labels, values, format, color) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padL = 52;
  const padR = 14;
  const padT = 22;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const max = Math.max(...values) * 1.12;
  const y = (v) => padT + plotH - (v / max) * plotH;
  const slot = plotW / values.length;
  const barW = Math.min(46, slot * 0.62);

  ctx.font = FONT;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const t of niceTicks(max, 4)) {
    if (t > max) continue;
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(padL, y(t));
    ctx.lineTo(width - padR, y(t));
    ctx.stroke();
    ctx.fillStyle = AXIS;
    ctx.fillText(format(t), padL - 8, y(t));
  }

  const points = [];
  values.forEach((v, i) => {
    const cx = padL + slot * i + slot / 2;
    ctx.fillStyle = color || BLUE;
    ctx.fillRect(cx - barW / 2, y(v), barW, padT + plotH - y(v));
    ctx.fillStyle = '#24344a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(format(v), cx, y(v) - 4);
    ctx.fillStyle = AXIS;
    ctx.textBaseline = 'top';
    const label = String(labels[i]);
    ctx.fillText(label.length > 14 ? label.slice(0, 13) + '…' : label, cx, height - padB + 8);
    points.push({ x: cx, y: y(v), year: labels[i], label: 'Value', value: v });
  });
  attachTooltip(canvas, points, (p) => `${p.year}: ${format(p.value)}`);
}

// A horizontal bar chart, used for shares that read better as rows.
export function hbarChart(canvas, rows, format, color) {
  const { ctx, width } = setupCanvas(canvas);
  const height = rows.length * 34 + 16;
  canvas.height = height * (window.devicePixelRatio || 1);
  canvas.style.height = height + 'px';
  ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  const padL = 188;
  const padR = 64;
  const max = Math.max(...rows.map((r) => r.value)) * 1.08;
  ctx.font = FONT;
  rows.forEach((row, i) => {
    const cy = 24 + i * 34;
    const barW = ((width - padL - padR) * row.value) / max;
    const label = row.label.length > 26 ? row.label.slice(0, 25) + '…' : row.label;
    ctx.fillStyle = '#24344a';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, padL - 10, cy);
    ctx.fillStyle = color || TEAL;
    ctx.fillRect(padL, cy - 9, Math.max(barW, 2), 18);
    ctx.fillStyle = '#24344a';
    ctx.textAlign = 'left';
    ctx.fillText(format(row.value), padL + Math.max(barW, 2) + 8, cy);
  });
}

// A small sparkline for the headline cards.
export function sparkline(canvas, values, color) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(120, Math.floor(rect.width));
  const height = 36;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = (max - min) || 1;
  const x = (i) => 2 + (i / (values.length - 1)) * (width - 4);
  const y = (v) => 3 + (1 - (v - min) / span) * (height - 6);
  ctx.strokeStyle = color || BLUE;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  values.forEach((v, i) => {
    if (i === 0) ctx.moveTo(x(i), y(v));
    else ctx.lineTo(x(i), y(v));
  });
  ctx.stroke();
  ctx.fillStyle = color || BLUE;
  ctx.beginPath();
  ctx.arc(x(values.length - 1), y(values[values.length - 1]), 3, 0, Math.PI * 2);
  ctx.fill();
}

export const COLORS = { blue: BLUE, teal: TEAL, gold: GOLD, red: RED };
