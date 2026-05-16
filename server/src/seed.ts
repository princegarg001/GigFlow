import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import { User } from './models/User';
import { Lead } from './models/Lead';

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Lead.deleteMany({});

  // Create users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.com',
    password: 'admin123',
    role: 'admin',
  });

  const salesUser = await User.create({
    name: 'Sales User',
    email: 'sales@smartleads.com',
    password: 'sales123',
    role: 'sales_user',
  });

  console.log('✅ Users seeded');

  // Create leads
  const leads = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', status: 'new', source: 'website', notes: 'Interested in enterprise plan', createdBy: admin._id },
    { name: 'Priya Patel', email: 'priya@example.com', status: 'contacted', source: 'instagram', notes: 'Follow up next week', createdBy: admin._id },
    { name: 'Amit Singh', email: 'amit@example.com', status: 'qualified', source: 'referral', notes: 'Ready for demo', createdBy: admin._id },
    { name: 'Sneha Gupta', email: 'sneha@example.com', status: 'lost', source: 'website', notes: 'Went with competitor', createdBy: salesUser._id },
    { name: 'Vikram Reddy', email: 'vikram@example.com', status: 'new', source: 'instagram', notes: 'Initial inquiry', createdBy: salesUser._id },
    { name: 'Anita Desai', email: 'anita@example.com', status: 'contacted', source: 'referral', notes: 'Sent pricing details', createdBy: admin._id },
    { name: 'Raj Malhotra', email: 'raj@example.com', status: 'qualified', source: 'website', notes: 'Needs custom integration', createdBy: admin._id },
    { name: 'Deepika Nair', email: 'deepika@example.com', status: 'new', source: 'referral', notes: 'Referred by Rahul', createdBy: salesUser._id },
    { name: 'Karan Mehta', email: 'karan@example.com', status: 'contacted', source: 'instagram', notes: 'Scheduled call for Tuesday', createdBy: admin._id },
    { name: 'Pooja Joshi', email: 'pooja@example.com', status: 'new', source: 'website', notes: 'Downloaded whitepaper', createdBy: salesUser._id },
    { name: 'Arjun Kapoor', email: 'arjun@example.com', status: 'qualified', source: 'referral', notes: 'Contract review in progress', createdBy: admin._id },
    { name: 'Meera Iyer', email: 'meera@example.com', status: 'lost', source: 'instagram', notes: 'Budget constraints', createdBy: salesUser._id },
    { name: 'Sanjay Verma', email: 'sanjay@example.com', status: 'new', source: 'website', notes: 'Exploring options', createdBy: admin._id },
    { name: 'Kavita Rao', email: 'kavita@example.com', status: 'contacted', source: 'referral', notes: 'Very interested in analytics', createdBy: admin._id },
    { name: 'Nikhil Agarwal', email: 'nikhil@example.com', status: 'new', source: 'instagram', notes: 'Saw our campaign', createdBy: salesUser._id },
  ];

  await Lead.insertMany(leads);
  console.log(`✅ ${leads.length} leads seeded`);

  console.log('\n📋 Login credentials:');
  console.log('  Admin:  admin@smartleads.com / admin123');
  console.log('  Sales:  sales@smartleads.com / sales123');

  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
