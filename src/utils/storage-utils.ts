import p5 from 'p5';
import config from '../config/config';

/**
 * Saves the current drawing to localStorage
 */
export function saveDrawingToLocalStorage(canvas: p5.Graphics): void {
  try {
    const dataURL = canvas.elt.toDataURL('image/png');
    localStorage.setItem(config.DRAWING_STORAGE_KEY, dataURL);

    // Show restart button when there's a saved drawing
    const restartIcon = document.getElementById('restart-icon');
    if (restartIcon) {
      restartIcon.style.display = 'flex';
    }
  } catch (error) {
    console.error('Error saving drawing to localStorage:', error);
  }
}

/**
 * Loads a drawing from localStorage
 * @returns true if a drawing was loaded, false otherwise
 */
export function loadDrawingFromLocalStorage(p: p5, targetBuffer: p5.Graphics): boolean {
  try {
    const savedDrawing = localStorage.getItem(config.DRAWING_STORAGE_KEY);
    if (savedDrawing) {
      // Create an image from the saved data URL
      const img = p.loadImage(savedDrawing, () => {
        // Draw the loaded image onto the buffer
        targetBuffer.image(img, 0, 0, targetBuffer.width, targetBuffer.height);
      });
      return true;
    }
  } catch (error) {
    console.error('Error loading drawing from localStorage:', error);
  }
  return false;
}

/**
 * Clears the drawing from localStorage
 */
export function clearDrawingFromLocalStorage(): void {
  try {
    localStorage.removeItem(config.DRAWING_STORAGE_KEY);

    // Hide restart button when there's no saved drawing
    const restartIcon = document.getElementById('restart-icon');
    if (restartIcon) {
      restartIcon.style.display = 'none';
    }
  } catch (error) {
    console.error('Error clearing drawing from localStorage:', error);
  }
}