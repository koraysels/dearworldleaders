import p5 from 'p5';
import tippy from 'tippy.js';
import { clearDrawingFromLocalStorage } from '../../utils/storage-utils';
import { Canvas } from '../canvas/Canvas';
import { Brush } from '../brush/Brush';

/**
 * Class to handle user interface interactions
 */
export class UI {
  private p: p5;
  private canvas: Canvas;
  private brush: Brush;

  /**
   * @param p - The p5 instance
   * @param canvas - The Canvas instance
   * @param brush - The Brush instance
   */
  constructor(p: p5, canvas: Canvas, brush: Brush) {
    this.p = p;
    this.canvas = canvas;
    this.brush = brush;
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
   * Sets up the color indicator
   */
  private setupColorIndicator(): void {
    const colorIndicator = document.getElementById('color-indicator');
    if (colorIndicator) {
      tippy(colorIndicator, {
        content: 'Click to change color',
        placement: 'top',
        arrow: true,
        animation: 'scale',
        theme: 'light'
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