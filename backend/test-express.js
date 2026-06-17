import express from 'express';
import { uploadImage } from './src/utils/cloudinary.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/api/complaints', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "No image" });

    console.log("Image received, size:", image.length);
    const secureImageUrl = await uploadImage(image);
    res.json({ url: secureImageUrl });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(5001, () => {
  console.log('Test server running on 5001');
});
