registerPaint('drawing', class {
  static get inputProperties() { return ['--drawing-color', '--lat', '--long']; }
  paint(ctx, size, properties) {
    // Get fill color from property
    const color = properties.get('--drawing-color');

    // Determine the center point and radius.
    const xCircle = properties.get('--long');
    const yCircle = properties.get('--lat');

    // Draw the circle o/
    ctx.beginPath();
    ctx.arc(xCircle, yCircle, xCircle, yCircle, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
});