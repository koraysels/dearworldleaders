import p5 from 'p5';
import config from '../../config/config';

/**
 * Class to handle brush mechanics and physics
 */
export class Brush {
  private brushSize: number;
  private isDrawing: boolean;
  private x: number;
  private y: number;
  private vx: number;
  private vy: number;
  private v: number;
  private r: number;
  private oldR: number;
  private spring: number;
  private friction: number;
  private splitNum: number;
  private diff: number;

  constructor() {
    // Initialize brush properties
    this.brushSize = config.brushSize;
    this.isDrawing = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.v = 0.5;
    this.r = 0;
    this.oldR = 0;
    this.spring = 0.4;
    this.friction = 0.45;
    this.splitNum = 100;
    this.diff = 2;
  }

  /**
   * Draw a brush stroke using spring physics
   */
  public drawSpringBrush(g: p5 | p5.Graphics, mouseX: number, mouseY: number): void {
    if (!this.isDrawing) {
      this.isDrawing = true;
      this.x = mouseX;
      this.y = mouseY;
      return;
    }

    // Apply spring physics
    this.vx += (mouseX - this.x) * this.spring;
    this.vy += (mouseY - this.y) * this.spring;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.v += Math.sqrt(this.vx * this.vx + this.vy * this.vy) - this.v;
    this.v *= 0.55;

    this.oldR = this.r;
    this.r = this.brushSize - this.v;

    // Draw multiple lines with slight variations to create brush effect
    for (let i = 0; i < this.splitNum; ++i) {
      const oldX = this.x;
      const oldY = this.y;
      this.x += this.vx / this.splitNum;
      this.y += this.vy / this.splitNum;
      this.oldR += (this.r - this.oldR) / this.splitNum;

      if (this.oldR < 1) { 
        this.oldR = 1; 
      }

      // Draw main line with variation
      g.strokeWeight(this.oldR + this.diff);
      g.line(
        this.x + g.random(0, 2), 
        this.y + g.random(0, 2), 
        oldX + g.random(0, 2), 
        oldY + g.random(0, 2)
      );

      // Draw additional lines for brush texture
      g.strokeWeight(this.oldR);
      g.line(
        this.x + this.diff * g.random(0.1, 2), 
        this.y + this.diff * g.random(0.1, 2), 
        oldX + this.diff * g.random(0.1, 2), 
        oldY + this.diff * g.random(0.1, 2)
      );
      g.line(
        this.x - this.diff * g.random(0.1, 2), 
        this.y - this.diff * g.random(0.1, 2), 
        oldX - this.diff * g.random(0.1, 2), 
        oldY - this.diff * g.random(0.1, 2)
      );
    }
  }

  /**
   * Reset the brush state when drawing stops
   */
  public resetBrush(): void {
    this.vx = 0;
    this.vy = 0;
    this.isDrawing = false;
  }

  /**
   * Reset all brush properties to initial values
   */
  public resetAll(): void {
    this.brushSize = config.brushSize;
    this.isDrawing = false;
    this.vx = 0;
    this.vy = 0;
    this.v = 0.5;
    this.r = 0;
    this.oldR = 0;
  }

  /**
   * Check if the brush is currently drawing
   */
  public getIsDrawing(): boolean {
    return this.isDrawing;
  }
}