import { toJpeg } from 'html-to-image';
import confetti from 'canvas-confetti';

/**
 * Export element to high-res 1080x1920 JPEG image file
 */
export async function downloadCardAsJpeg(node, gamertag = 'xbox-gamer') {
  if (!node) {
    throw new Error('Canvas element not found for export');
  }

  try {
    // Generate JPEG with maximum quality and 1080x1920 scale
    const dataUrl = await toJpeg(node, {
      quality: 0.95,
      canvasWidth: 1080,
      canvasHeight: 1920,
      pixelRatio: 1,
      cacheBust: true,
      filter: (domNode) => {
        // Exclude non-essential elements if any
        return true;
      }
    });

    // Create trigger link download
    const cleanGamertag = (gamertag || 'gamer').replace(/\s+/g, '_');
    const filename = `XboxCard-${cleanGamertag}.jpg`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti optional
    }

    return true;
  } catch (error) {
    console.error('Error generating card JPEG:', error);
    throw error;
  }
}
