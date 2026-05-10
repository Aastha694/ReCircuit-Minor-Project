import Buyer from '../models/Buyer.js';

const VALID_CATEGORIES = ['mobile_device', 'laptop_tablet', 'circuit_board', 'battery', 'other'];

export const getBuyersByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    // Match buyers and sort by specialisation (fewer categories = more specialised)
    const buyers = await Buyer.find({
      accepted_categories: category,
    }).sort({ accepted_categories: 1 });

    return res.status(200).json({ buyers });
  } catch (err) {
    console.error('Buyer fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch buyers' });
  }
};
