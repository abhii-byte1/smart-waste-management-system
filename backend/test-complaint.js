import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Complaint from './src/models/Complaint.js';
import User from './src/models/User.js';
import { uploadImage } from './src/utils/cloudinary.js';

dotenv.config();

const testSubmit = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");
    
    const user = await User.findOne({ role: 'user' });
    if (!user) {
      console.log("No user found");
      return;
    }

    const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    console.log("Uploading to Cloudinary...");
    const secureImageUrl = await uploadImage(sampleBase64);
    console.log("Uploaded! URL:", secureImageUrl);

    const complaint = await Complaint.create({
      ticketId: "123456",
      location: "Test Location",
      coordinates: { lat: 0, lng: 0 },
      description: "Test Description",
      image: secureImageUrl,
      priority: "Low",
      status: 'Pending',
      reportedBy: user._id
    });

    console.log("Complaint created successfully:", complaint._id);
    
    await Complaint.findByIdAndDelete(complaint._id);
    console.log("Test complaint deleted");

    process.exit(0);
  } catch (err) {
    console.error("Test failed!");
    console.error(err);
    process.exit(1);
  }
};

testSubmit();
