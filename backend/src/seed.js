import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        name: 'System Admin',
        email: 'admin@smartwaste.com',
        password: 'Admin@123',
        role: 'admin'
      },
      {
        name: 'Community User',
        email: 'user@smartwaste.com',
        password: 'User@123',
        role: 'user'
      }
    ];

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
      }
    }

    console.log('Seed complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
