import p5 from 'p5';
import { saveDrawingToLocalStorage } from '../../utils/storage-utils';
import config from '../../config/config';

/**
 * Class to handle canvas creation and management
 */
export class Canvas {
  private p: p5;
  private drawingBuffer: p5.Graphics | null = null;
  private hasSavedDrawing: boolean = false;
  private currentBlendMode: string = config.defaultBlendMode;

  /**
   * @param p - The p5 instance
   */
  constructor(p: p5) {
    this.p = p;
  }

  /**
   * Creates the drawing buffer
   */
  public createDrawingBuffer(): p5.Graphics {
    // Create drawing buffer with the same dimensions as the canvas
    this.drawingBuffer = this.p.createGraphics(this.p.width, this.p.height);
    this.drawingBuffer.pixelDensity(2);
    this.drawingBuffer.smooth();

    // Set blend mode from config for the drawing buffer
    this.applyBlendMode();

    return this.drawingBuffer;
  }

  /**
   * Applies the current blend mode to the drawing buffer
   */
  private applyBlendMode(): void {
    if (this.drawingBuffer) {
      // Apply the current blend mode
      this.drawingBuffer.blendMode(this.p[this.currentBlendMode]);
    }
  }

  /**
   * Sets the blend mode for the drawing buffer
   * @param blendMode - The blend mode to set
   */
  public setBlendMode(blendMode: string): void {
    if (config.blendModes.includes(blendMode)) {
      this.currentBlendMode = blendMode;
      this.applyBlendMode();
    }
  }

  /**
   * Gets the current blend mode
   */
  public getBlendMode(): string {
    return this.currentBlendMode;
  }

  /**
   * Gets the current drawing buffer
   */
  public getDrawingBuffer(): p5.Graphics | null {
    return this.drawingBuffer;
  }

  /**
   * Sets the stroke color for the drawing buffer with configurable opacity
   */
  public setStrokeColor(color: string): void {
    if (this.drawingBuffer) {
      // Parse the hex color and add the opacity value
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const a = config.brushOpacity * 255; // Convert 0-1 to 0-255 for p5.js

      this.drawingBuffer.stroke(r, g, b, a);
    }
  }

  /**
   * Sets the stroke weight for the drawing buffer
   */
  public setStrokeWeight(weight: number): void {
    if (this.drawingBuffer) {
      this.drawingBuffer.strokeWeight(weight);
    }
  }

  /**
   * Clears the drawing buffer
   */
  public clearDrawingBuffer(): void {
    if (this.drawingBuffer) {
      this.drawingBuffer.clear();
    }
    this.hasSavedDrawing = false;
  }

  /**
   * Resizes the drawing buffer when the window is resized
   */
  public resize(tempDrawingBuffer: p5.Image | null = null): void {
    // Recreate the drawing buffer with new dimensions
    this.drawingBuffer = this.p.createGraphics(this.p.width, this.p.height);
    this.drawingBuffer.pixelDensity(2);
    this.drawingBuffer.smooth();

    // Apply the current blend mode
    this.applyBlendMode();

    // Copy the content back if we had a previous buffer
    if (tempDrawingBuffer && this.drawingBuffer) {
      this.drawingBuffer.image(tempDrawingBuffer, 0, 0, this.p.width, this.p.height);

      // If we had a saved drawing, save the resized version to localStorage
      if (this.hasSavedDrawing) {
        saveDrawingToLocalStorage(this.drawingBuffer);
      }
    }
  }

  /**
   * Saves the current drawing to localStorage
   */
  public saveDrawing(): void {
    if (this.drawingBuffer && this.hasSavedDrawing) {
      saveDrawingToLocalStorage(this.drawingBuffer);
    }
  }

  /**
   * Sets the hasSavedDrawing flag
   */
  public setHasSavedDrawing(value: boolean): void {
    this.hasSavedDrawing = value;
  }

  /**
   * Gets the hasSavedDrawing flag
   */
  public getHasSavedDrawing(): boolean {
    return this.hasSavedDrawing;
  }

  /**
   * Creates a temporary copy of the drawing buffer content
   */
  public createTempDrawingBuffer(): p5.Image | null {
    if (this.drawingBuffer) {
      const tempDrawingBuffer = this.p.createImage(this.drawingBuffer.width, this.drawingBuffer.height);
      tempDrawingBuffer.copy(
        this.drawingBuffer, 
        0, 0, this.drawingBuffer.width, this.drawingBuffer.height, 
        0, 0, this.drawingBuffer.width, this.drawingBuffer.height
      );
      return tempDrawingBuffer;
    }
    return null;
  }
}
