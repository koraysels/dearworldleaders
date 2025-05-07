import config from '../config/config';

/**
 * Returns a random color from the config colors array
 */
export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * config.colors.length);
  return config.colors[randomIndex];
}

/**
 * Updates the color indicator element with the given color
 */
export function updateColorIndicator(color: string): void {
  const colorIndicator = document.getElementById('color-indicator');
  if (colorIndicator) {
    colorIndicator.style.backgroundColor = color;
  }
}