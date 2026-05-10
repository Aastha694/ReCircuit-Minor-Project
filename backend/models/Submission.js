import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user_id: {
    type: String, // Clerk user ID (string, not ObjectId)
    required: [true, 'User ID is required'],
  },
  image_path: {
    type: String,
    required: [true, 'Image path is required'],
  },
  ai_category: {
    type: String,
    required: true,
    enum: ['mobile_device', 'laptop_tablet', 'circuit_board', 'battery', 'other'],
  },
  ai_confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  user_category: {
    type: String,
    enum: ['mobile_device', 'laptop_tablet', 'circuit_board', 'battery', 'other'],
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
