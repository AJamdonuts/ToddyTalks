// Small helper to scale the .canvas element so it fits inside the viewport
// without adding scrollbars. This will only scale down (never upscale).
function scaleCanvasToFit(selector = '.canvas') {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  // Temporarily clear any previous transform so measurement is accurate
  const prevTransform = canvas.style.transform || '';
  canvas.style.transform = 'none';

  // Measure natural size
  const rect = canvas.getBoundingClientRect();
  const naturalWidth = rect.width;
  const naturalHeight = rect.height;

  // Avoid jitter when canvas has zero size
  if (naturalWidth === 0 || naturalHeight === 0) {
    canvas.style.transform = prevTransform;
    return;
  }

  // Compute scale to fit entirely within viewport, without upscaling
  const scale = Math.min(window.innerWidth / naturalWidth, window.innerHeight / naturalHeight, 1);
  canvas.style.transform = `scale(${scale})`;

  // Center the canvas in the window if there's extra space
  const xOffset = Math.max((window.innerWidth - naturalWidth * scale) / 2, 0);
  const yOffset = Math.max((window.innerHeight - naturalHeight * scale) / 2, 0);
  canvas.style.marginLeft = `${xOffset}px`;
  canvas.style.marginTop = `${yOffset}px`;
}

window.addEventListener('load', () => scaleCanvasToFit());
window.addEventListener('resize', () => scaleCanvasToFit());

// Optional: expose function for debugging / manual usage
window.scaleCanvasToFit = scaleCanvasToFit;
