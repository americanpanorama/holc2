const getAdjustedColor = (desired, background, a) => {
  const d = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(desired);
  const r3 = parseInt(d[1], 16);
  const g3 = parseInt(d[2], 16);
  const b3 = parseInt(d[3], 16);

  const b = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(background);
  const r2 = parseInt(b[1], 16);
  const g2 = parseInt(b[2], 16);
  const b2 = parseInt(b[3], 16);

  let r1 = Math.max((r3 - r2 + r2 * a) / a, 0);
  let g1 = Math.max((g3 - g2 + g2 * a) / a, 0);
  let b1 = Math.max((b3 - b2 + b2 * a) / a, 0);

  const max = Math.max(r1, g1, b1);

  if (max > 255) {
    const multiplier = 255 / max;
    r1 = r1 * multiplier;
    g1 = g1 * multiplier;
    b1 = b1 * multiplier;
  }

  r1 = Math.round(r1);
  b1 = Math.round(b1);
  g1 = Math.round(g1);

  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return `#${componentToHex(r1)}${componentToHex(g1)}${componentToHex(b1)}`;
};

console.log('A', getAdjustedColor('#76a865', '#8a908b', 0.4));
console.log('B', getAdjustedColor('#7cb5bd', '#424a4f', 0.4));
console.log('C', getAdjustedColor('#d8d165', '#f9f9f0', 0.4));
console.log('D', getAdjustedColor('#d9838d', '#a29997', 0.4));
