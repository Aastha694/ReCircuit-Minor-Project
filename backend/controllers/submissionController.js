import Submission from '../models/Submission.js';
import Buyer from '../models/Buyer.js';

const VALID_CATEGORIES = ['mobile_device', 'laptop_tablet', 'circuit_board', 'battery', 'other'];

export const updateSubmissionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const userId = req.auth?.userId;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    // Find submission and verify ownership
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    if (submission.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this submission' });
    }

    // Update the user-overridden category
    submission.user_category = category;
    await submission.save();

    // Re-match buyers with the new category
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
    console.error('Category update error:', err);
    return res.status(500).json({ error: 'Failed to update category' });
  }
};
