import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import Submission from '../models/Submission.js';
import Buyer from '../models/Buyer.js';

import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

export const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    const userId = req.auth?.userId;

    if (!userId) {
      // Cleanup file if unauthorized
      await fs.unlink(imagePath).catch(() => {});
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Step 1: Call AI service for classification
    let classification;
    try {
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/classify`,
        { image_path: imagePath },
        { timeout: 15000 }
      );
      classification = aiResponse.data;
    } catch (aiError) {
      console.error('AI Service error:', aiError.message);
      classification = { category: 'other', confidence: 0 };
    }

    // Step 2: Apply low-confidence threshold
    let { category, confidence } = classification;
    if (confidence < 0.4) category = 'other';

    // Step 3: Save submission to DB
    const submission = await Submission.create({
      user_id: userId,
      image_path: `/uploads/${req.file.filename}`,
      ai_category: category,
      ai_confidence: confidence,
      user_category: category,
    });

    // Step 4: Match buyers
    const buyers = await Buyer.find({
      accepted_categories: category,
    }).sort({ accepted_categories: 1 });

    return res.status(200).json({
      submission: {
        id: submission._id,
        image_path: submission.image_path,
        ai_category: submission.ai_category,
        ai_confidence: submission.ai_confidence,
        user_category: submission.user_category,
        created_at: submission.created_at,
      },
      buyers: buyers.map((b) => ({
        id: b._id,
        name: b.name,
        accepted_categories: b.accepted_categories,
        contact_email: b.contact_email,
        contact_phone: b.contact_phone,
        location_city: b.location_city,
      })),
    });
  } catch (err) {
    console.error('Upload error:', err);
    // Cleanup file if an exception happens down the pipeline
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    return res.status(500).json({ error: 'Failed to process upload' });
  }
};
