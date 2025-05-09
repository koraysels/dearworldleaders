import p5 from 'p5';
import config from '../../config/config';

/**
 * Class to handle text rendering functionality
 */
export class TextLayer {
  private p: p5;
  private textLayer: p5.Graphics | null = null;
  private font: p5.Font;

  /**
   * @param p - The p5 instance
   * @param font - The font to use for the text
   */
  constructor(p: p5, font: p5.Font) {
    this.p = p;
    this.font = font;
  }

  /**
   * Creates the text layer with the text from config
   */
  public createTextLayer(): p5.Graphics {
    // Create a graphics buffer for the text
    this.textLayer = this.p.createGraphics(this.p.width, this.p.height);
    this.textLayer.pixelDensity(2);
    this.textLayer.smooth();

    // Set the font
    this.textLayer.textFont(this.font);

    // Calculate font size based on canvas dimensions
    const scaleFactor = Math.min(
      this.p.width / config.baseWidth, 
      this.p.height / config.baseHeight
    );
    const fontSize = config.fontSize * scaleFactor;

    // Set text alignment
    this.textLayer.textAlign(this.p.CENTER, this.p.CENTER);

    // Use the text lines from config
    const lines = config.text;

    // Calculate line height and vertical spacing
    const lineHeight = 167 * scaleFactor; // Use 167pts line height as specified
    const totalHeight = lineHeight * lines.length;
    const startY = (this.p.height - totalHeight) / 2 + lineHeight / 4;

    // Draw each line of text with different styling
    lines.forEach((line, index) => {
      const yPos = startY + index * lineHeight;

      if (index === 0) {
        // First line: "Dear world Leaders" - black fill, 90pts
        const firstLineFontSize = 90 * scaleFactor;
        this.textLayer?.textSize(firstLineFontSize);
        this.textLayer?.fill(0); // Black fill
        this.textLayer?.stroke(0); // Black stroke
        this.textLayer?.strokeWeight(0); // No stroke

        // Center align the first line
        this.textLayer?.text(line, this.p.width / 2, yPos);
      } else {
        // Other lines: transparent fill with black stroke
        this.textLayer?.textSize(fontSize);
        this.textLayer?.fill(0, 0); // Transparent fill
        this.textLayer?.stroke(0); // Black stroke
        this.textLayer?.strokeWeight(config.strokeWeight * scaleFactor);

        // Justify the last 3 lines
        this.drawJustifiedText(line, yPos, fontSize);
      }
    });

    return this.textLayer;
  }

  /**
   * Gets the current text layer
   */
  public getTextLayer(): p5.Graphics | null {
    return this.textLayer;
  }

  /**
   * Resizes the text layer when the window is resized
   */
  public resize(): p5.Graphics | null {
    return this.createTextLayer();
  }

  /**
   * Draws justified text by spacing characters evenly across the width
   * @param text - The text to justify
   * @param yPos - The vertical position
   * @param fontSize - The font size
   */
  private drawJustifiedText(text: string, yPos: number, fontSize: number): void {
    if (!this.textLayer) return;

    // Set the font size
    this.textLayer.textSize(fontSize);

    // Define the width to justify to (80% of canvas width)
    const justifyWidth = this.p.width * 0.94;

    // Calculate the total width of the text
    const textWidth = this.textLayer.textWidth(text);

    // Calculate the spacing between characters
    const chars = text.split('');
    const totalSpacing = justifyWidth - textWidth;
    const spaceBetweenChars = totalSpacing / (chars.length - 1);

    // Save current text alignment
    const currentAlign = this.textLayer.drawingContext.textAlign;

    // Set text alignment to LEFT for precise character positioning
    this.textLayer.textAlign(this.p.LEFT, this.p.CENTER);

    // Start position (left-aligned at 10% from left edge)
    let xPos = this.p.width * 0.03;

    // Draw each character with calculated spacing
    chars.forEach((char) => {
      this.textLayer?.text(char, xPos, yPos);

      // Move to the next character position
      // Add a small buffer (1px) to prevent any potential overlap
      xPos += this.textLayer!.textWidth(char) + spaceBetweenChars;
    });

    // Restore original text alignment
    this.textLayer.textAlign(currentAlign, this.p.CENTER);
  }
}
