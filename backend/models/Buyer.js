import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Buyer name is required'],
    trim: true,
  },
  accepted_categories: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'At least one accepted category is required',
    },
    enum: ['mobile_device', 'laptop_tablet', 'circuit_board', 'battery', 'other'],
  },
  contact_email: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
  },
  contact_phone: {
    type: String,
    trim: true,
    default: '',
  },
  location_city: {
    type: String,
    trim: true,
    default: '',
  },
});

const Buyer = mongoose.model('Buyer', buyerSchema);
export default Buyer;
