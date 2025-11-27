function calculateScaleFactor() {
    // Define the original design dimensions
    const DESIGN_WIDTH = 1440;
    const DESIGN_HEIGHT = 1024;

    // Get the current viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the scale factor for both dimensions
    const widthScale = viewportWidth / DESIGN_WIDTH;
    const heightScale = viewportHeight / DESIGN_HEIGHT;

    // Use the smaller scale factor to ensure everything fits inside the window
    const scaleFactor = Math.min(widthScale, heightScale);

    // Get the .canvas element
    const canvas = document.querySelector('.canvas');

    // Apply the scale factor as a CSS variable
    if (canvas) {
        // If the viewport is larger than the design max, don't scale up past 1
        const finalScale = Math.min(scaleFactor, 1); 
        canvas.style.setProperty('--scale-factor', finalScale);

        // Additionally, set the fixed width/height so the centering works correctly
        canvas.style.width = `${DESIGN_WIDTH}px`;
        canvas.style.height = `${DESIGN_HEIGHT}px`;
    }
}

// Run on load and on every window resize
window.addEventListener('resize', calculateScaleFactor);
document.addEventListener('DOMContentLoaded', calculateScaleFactor);