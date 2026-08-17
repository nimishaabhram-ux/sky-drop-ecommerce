export interface CompressedImageResult {
  dataUrl: string;
  blob: Blob;
  sizeKb: number;
  width: number;
  height: number;
}

export async function compressImage(
  imageSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | string,
  maxWidth = 1280,
  maxHeight = 960,
  quality = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const processElement = (element: CanvasImageSource, naturalWidth: number, naturalHeight: number) => {
      let targetWidth = naturalWidth;
      let targetHeight = naturalHeight;

      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      // Draw image
      ctx.drawImage(element, 0, 0, targetWidth, targetHeight);

      // Subtle contrast / sharpness enhancement for photogrammetry feature matching
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Blob generation failed'));
            return;
          }
          const sizeKb = Math.round(blob.size / 1024);
          resolve({
            dataUrl,
            blob,
            sizeKb,
            width: targetWidth,
            height: targetHeight,
          });
        },
        'image/jpeg',
        quality
      );
    };

    if (imageSource instanceof HTMLVideoElement) {
      processElement(imageSource, imageSource.videoWidth || 1280, imageSource.videoHeight || 720);
    } else if (imageSource instanceof HTMLImageElement) {
      if (imageSource.complete) {
        processElement(imageSource, imageSource.naturalWidth, imageSource.naturalHeight);
      } else {
        imageSource.onload = () => processElement(imageSource, imageSource.naturalWidth, imageSource.naturalHeight);
      }
    } else if (typeof imageSource === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processElement(img, img.naturalWidth, img.naturalHeight);
      img.onerror = (e) => reject(e);
      img.src = imageSource;
    } else if (imageSource instanceof Blob) {
      const url = URL.createObjectURL(imageSource);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        processElement(img, img.naturalWidth, img.naturalHeight);
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    } else {
      processElement(imageSource, imageSource.width, imageSource.height);
    }
  });
}
