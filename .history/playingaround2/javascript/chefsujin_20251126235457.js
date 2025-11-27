function calculateScaleFactor() {
    const DESIGN_WIDTH = 1400;
    const DESIGN_HEIGHT = 500;
    const MIN_SCALE = 0.5;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const widthScale = viewportWidth / DESIGN_WIDTH;
    const heightScale = viewportHeight / DESIGN_HEIGHT;

    const scaleFactor = Math.min(widthScale, heightScale, 1); // never scale above 1
    const finalScale = Math.max(scaleFactor, MIN_SCALE);      // never scale below MIN_SCALE

    const canvas = document.querySelector('.canvas');
    if (canvas) {
        canvas.style.setProperty('--scale-factor', finalScale);
    }
}

window.addEventListener('resize', calculateScaleFactor);
document.addEventListener('DOMContentLoaded', calculateScaleFactor);

