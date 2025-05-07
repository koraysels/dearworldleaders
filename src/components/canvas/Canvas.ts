import p5 from 'p5';
import { saveDrawingToLocalStorage } from '../../utils/storage-utils';

/**
 * Class to handle canvas creation and management
 */
export class Canvas {
  private p: p5;
  private drawingBuffer: p5.Graphics | null = null;
  private hasSavedDrawing: boolean = false;

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

    // Set blend mode to MULTIPLY for the drawing buffer
    this.drawingBuffer.blendMode(this.p.MULTIPLY);

    return this.drawingBuffer;
  }

  /**
   * Gets the current drawing buffer
   */
  public getDrawingBuffer(): p5.Graphics | null {
    return this.drawingBuffer;
  }

  /**
   * Sets the stroke color for the drawing buffer
   */
  public setStrokeColor(color: string): void {
    if (this.drawingBuffer) {
      this.drawingBuffer.stroke(color);
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
    this.drawingBuffer.blendMode(this.p.MULTIPLY);

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
