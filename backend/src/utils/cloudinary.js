import { v2 as cloudinary } from 'cloudinary';

/**
 * Uploads a base64 image string to Cloudinary
 * @param {string} base64Image - The base64 data URI of the image
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (base64Image) => {
  try {
    if (!base64Image) return '';
    
    // Check if it's already a URL (e.g., from an update or seeder)
    if (base64Image.startsWith('http')) {
      return base64Image;
    }

    // Configure dynamically to ensure process.env is fully loaded by server.js
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'smart_waste_management',
      // Auto-optimize quality and format for performance
      transformation: [
        { width: 640, crop: 'limit' },
        { quality: 'auto:low' },
        { fetch_format: 'auto' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Cloudinary Error: ${error.message || 'Unknown configuration issue'}`);
  }
};
