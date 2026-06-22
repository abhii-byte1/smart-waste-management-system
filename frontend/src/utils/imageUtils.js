/** Shared image attributes for list/thumbnail views (mobile-friendly, low CLS). */
export const lazyImageProps = {
  loading: 'lazy',
  decoding: 'async',
  fetchPriority: 'low'
};

/**
 * Compress a File to WebP data URL. Tuned for 2–4 GB RAM mobile devices.
 * @param {File} file
 * @param {{ maxDimension?: number; quality?: number }} options
 */
export const compressImageFile = (file, { maxDimension = 1024, quality = 0.68 } = {}) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * Build descriptive alt text for complaint evidence images.
 */
export const complaintImageAlt = (complaint, fallback = 'Complaint evidence') => {
  if (!complaint) return fallback;
  const ticket = complaint.ticketId ? `ticket ${complaint.ticketId}` : 'complaint';
  const location = complaint.location ? ` at ${complaint.location}` : '';
  return `Evidence photo for ${ticket}${location}`;
};
