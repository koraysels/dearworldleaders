import config from '../config/config';

/**
 * Calculates canvas dimensions with 4:3 aspect ratio that fit within the window
 */
export function calculateCanvasDimensions(windowWidth: number, windowHeight: number) {
  // Calculate dimensions that fit within the window while maintaining 4:3 ratio
  let canvasWidth, canvasHeight;

  // If window is wider than 4:3 would require
  if (windowWidth / windowHeight > config.aspectRatio) {
    // Height is the limiting factor
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * config.aspectRatio;
  } else {
    // Width is the limiting factor
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / config.aspectRatio;
  }

  return { width: canvasWidth, height: canvasHeight };
}