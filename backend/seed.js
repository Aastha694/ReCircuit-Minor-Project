import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Buyer from './models/Buyer.js';

dotenv.config();

const buyers = [
  {
    name: 'GreenTech Recyclers',
    accepted_categories: ['mobile_device'],
    contact_email: 'info@greentechrecyclers.com',
    contact_phone: '+91-9876543210',
    location_city: 'Delhi',
  },
  {
    name: 'EcoMobile Solutions',
    accepted_categories: ['mobile_device', 'battery'],
    contact_email: 'contact@ecomobile.in',
    contact_phone: '+91-9123456780',
    location_city: 'Mumbai',
  },
  {
    name: 'LaptopRevive India',
    accepted_categories: ['laptop_tablet'],
    contact_email: 'sales@laptoprevive.co.in',
    contact_phone: '+91-8765432109',
    location_city: 'Bangalore',
  },
  {
    name: 'SecondScreen Electronics',
    accepted_categories: ['laptop_tablet', 'mobile_device'],
    contact_email: 'buy@secondscreen.in',
    contact_phone: '+91-7654321098',
    location_city: 'Hyderabad',
  },
  {
    name: 'CircuitHarvest Pvt Ltd',
    accepted_categories: ['circuit_board'],
    contact_email: 'procurement@circuitharvest.com',
    contact_phone: '+91-6543210987',
    location_city: 'Chennai',
  },
  {
    name: 'BoardMasters Recycling',
    accepted_categories: ['circuit_board', 'other'],
    contact_email: 'hello@boardmasters.in',
    contact_phone: '+91-5432109876',
    location_city: 'Pune',
  },
  {
    name: 'PowerCell Recovery',
    accepted_categories: ['battery'],
    contact_email: 'recover@powercell.in',
    contact_phone: '+91-4321098765',
    location_city: 'Ahmedabad',
  },
  {
    name: 'BatteryGreen Solutions',
    accepted_categories: ['battery', 'mobile_device'],
    contact_email: 'info@batterygreen.co.in',
    contact_phone: '+91-3210987654',
    location_city: 'Jaipur',
  },
  {
    name: 'AllWaste Electronics',
    accepted_categories: ['mobile_device', 'laptop_tablet', 'circuit_board', 'battery', 'other'],
    contact_email: 'allwaste@electronics.in',
    contact_phone: '+91-2109876543',
    location_city: 'Delhi',
  },
  {
    name: 'ReUse Hub',
    accepted_categories: ['laptop_tablet', 'other'],
    contact_email: 'contact@reusehub.in',
    contact_phone: '+91-1098765432',
    location_city: 'Kolkata',
  },
  {
    name: 'SmartScrap Industries',
    accepted_categories: ['circuit_board', 'battery'],
    contact_email: 'info@smartscrap.in',
    contact_phone: '+91-9988776655',
    location_city: 'Lucknow',
  },
  {
    name: 'UrbanMine Recyclers',
    accepted_categories: ['mobile_device', 'circuit_board'],
    contact_email: 'recycle@urbanmine.co.in',
    contact_phone: '+91-8877665544',
    location_city: 'Chandigarh',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing buyers
    await Buyer.deleteMany({});
    console.log('🗑️  Cleared existing buyer data');

    // Insert seed data
    const result = await Buyer.insertMany(buyers);
    console.log(`🌱 Seeded ${result.length} buyers successfully`);

    // Display summary
    const categories = ['mobile_device', 'laptop_tablet', 'circuit_board', 'battery', 'other'];
    for (const cat of categories) {
      const count = await Buyer.countDocuments({ accepted_categories: cat });
      console.log(`   ${cat}: ${count} buyers`);
    }

    await mongoose.connection.close();
    console.log('✅ Done. Connection closed.');
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
