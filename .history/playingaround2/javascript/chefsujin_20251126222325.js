function calculateScaleFactor() {
    const DESIGN_WIDTH = 10;
    const DESIGN_HEIGHT = 10;
    


    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the scale factor based on current viewport size
    const widthScale = viewportWidth / DESIGN_WIDTH;
    const heightScale = viewportHeight / DESIGN_HEIGHT;

    // Use the smaller scale factor to ensure everything fits inside the window
    let scaleFactor = Math.min(widthScale, heightScale);

    // Get the .canvas element
    const canvas = document.querySelector('.canvas');

    if (canvas) {
        // Step 1: Prevent scaling up past 1 (full size)
        scaleFactor = Math.min(scaleFactor, 1); 
        
        // *** Step 2: Ensure the scale factor does not drop below the minimum ***
        const finalScale = Math.max(scaleFactor, MIN_SCALE);
        
        canvas.style.setProperty('--scale-factor', finalScale);

        // Additionally, set the fixed width/height so the centering works correctly
        canvas.style.width = `${DESIGN_WIDTH}px`;
        canvas.style.height = `${DESIGN_HEIGHT}px`;
    }
}

window.addEventListener('resize', calculateScaleFactor);
document.addEventListener('DOMContentLoaded', calculateScaleFactor);