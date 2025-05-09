import p5 from 'p5';
import tippy from 'tippy.js';
import { clearDrawingFromLocalStorage } from '../../utils/storage-utils';
import { Canvas } from '../canvas/Canvas';
import { Brush } from '../brush/Brush';
import config from '../../config/config';

/**
 * Class to handle user interface interactions
 */
export class UI {
  private p: p5;
  private canvas: Canvas;
  private brush: Brush;
  private onColorSelect: (color: string) => void;

  /**
   * @param p - The p5 instance
   * @param canvas - The Canvas instance
   * @param brush - The Brush instance
   * @param onColorSelect - Callback function when a color is selected
   */
  constructor(p: p5, canvas: Canvas, brush: Brush, onColorSelect: (color: string) => void) {
    this.p = p;
    this.canvas = canvas;
    this.brush = brush;
    this.onColorSelect = onColorSelect;
    this.setupUIElements();
  }

  /**
   * Sets up UI elements and their event listeners
   */
  private setupUIElements(): void {
    this.setupSaveIcon();
    this.setupRestartIcon();
    this.setupColorIndicator();
  }

  /**
   * Sets up the save icon
   */
  private setupSaveIcon(): void {
    const saveIcon = document.getElementById('save-icon');
    if (saveIcon) {
      saveIcon.addEventListener('click', () => {
        this.p.save('dearworldleaders_drawing.png');
      });

      // Initialize tooltip for save icon
      tippy(saveIcon, {
        content: 'Save as PNG',
        placement: 'top',
        arrow: true,
        animation: 'scale',
        theme: 'light'
      });
    }
  }

  /**
   * Sets up the restart icon
   */
  private setupRestartIcon(): void {
    const restartIcon = document.getElementById('restart-icon');
    if (restartIcon) {
      restartIcon.addEventListener('click', () => {
        // Clear the drawing buffer
        this.canvas.clearDrawingBuffer();

        // Reset brush
        this.brush.resetAll();

        // Clear localStorage
        clearDrawingFromLocalStorage();

        // Reset saved drawing flag
        this.canvas.setHasSavedDrawing(false);
      });

      // Initialize tooltip for restart icon
      tippy(restartIcon, {
        content: 'Start new drawing',
        placement: 'top',
        arrow: true,
        animation: 'scale',
        theme: 'light'
      });
    }
  }

  /**
   * Sets up the color indicator with a color picker menu
   */
  private setupColorIndicator(): void {
    const colorIndicator = document.getElementById('color-indicator');
    if (colorIndicator) {
      // Create color picker HTML content
      const colorPickerContent = document.createElement('div');
      colorPickerContent.className = 'color-picker-menu';
      colorPickerContent.style.display = 'flex';
      colorPickerContent.style.flexWrap = 'wrap';
      colorPickerContent.style.gap = '8px';
      colorPickerContent.style.maxWidth = '200px';
      colorPickerContent.style.padding = '8px';

      // Add a random color option with a multicolor wheel appearance
      const randomColorSwatch = document.createElement('div');
      randomColorSwatch.className = 'color-swatch random-color';
      randomColorSwatch.style.width = '30px';
      randomColorSwatch.style.height = '30px';
      randomColorSwatch.style.borderRadius = '50%';
      randomColorSwatch.style.cursor = 'pointer';
      randomColorSwatch.style.border = '2px solid white';
      randomColorSwatch.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
      // Create a multicolor gradient for the random color swatch
      randomColorSwatch.style.background = 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)';

      // Add click handler to select random color mode
      randomColorSwatch.addEventListener('click', () => {
        this.onColorSelect('random');
        // Close the tippy instance
        colorIndicatorTippy.hide();
      });

      colorPickerContent.appendChild(randomColorSwatch);

      // Add color swatches for each color in config
      config.colors.forEach(color => {
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'color-swatch';
        colorSwatch.style.width = '30px';
        colorSwatch.style.height = '30px';
        colorSwatch.style.backgroundColor = color;
        colorSwatch.style.borderRadius = '50%';
        colorSwatch.style.cursor = 'pointer';
        colorSwatch.style.border = '2px solid white';
        colorSwatch.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';

        // Add click handler to select this color
        colorSwatch.addEventListener('click', () => {
          this.onColorSelect(color);
          // Close the tippy instance
          colorIndicatorTippy.hide();
        });

        colorPickerContent.appendChild(colorSwatch);
      });

      // Create tippy instance with the color picker content
      const colorIndicatorTippy = tippy(colorIndicator, {
        content: colorPickerContent,
        placement: 'top',
        arrow: true,
        animation: 'scale',
        theme: 'light',
        interactive: true, // Allow interaction with the menu
        trigger: 'mouseenter', // Show on hover instead of click
        appendTo: document.body // Append to body to avoid positioning issues
      });
    }
  }

  /**
   * Updates the UI based on whether there's a saved drawing
   */
  public updateUIForSavedDrawing(hasSavedDrawing: boolean): void {
    const restartIcon = document.getElementById('restart-icon');
    if (restartIcon) {
      restartIcon.style.display = hasSavedDrawing ? 'flex' : 'none';
    }
  }
}
