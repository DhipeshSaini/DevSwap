import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirectImageUrl(url: string | undefined): string {
  if (!url) return 'https://picsum.photos/seed/placeholder/200/200';
  
  const cleanUrl = url.trim();
  
  // Directly return data URIs and blob URLs without modification
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }
  
  // Handle Google Drive links only when the URL actually originates from Google Drive/Docs
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    const driveMatch = cleanUrl.match(/(?:d\/|id=|id\/|folders\/)([\w-]{25,})/);
    if (driveMatch && driveMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
  }
  
  // Handle Imgur links that aren't direct
  if (cleanUrl.includes('imgur.com') && !cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    const imgurMatch = cleanUrl.match(/imgur\.com\/(?:a\/|gallery\/)?(\w+)/);
    if (imgurMatch && imgurMatch[1]) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }
  }
  
  return cleanUrl;
}

export function processAvatarFile(file: File, maxSize = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (PNG, JPG, WebP, etc.).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize canvas context.'));
          return;
        }

        // Fill background white to handle transparent PNG/WebP images cleanly
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Compact JPEG format (quality 0.85) to fit comfortably in Firestore document
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
