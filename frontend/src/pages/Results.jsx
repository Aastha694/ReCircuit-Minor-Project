import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const FORMAT_CATEGORIES = {
  mobile_device: 'Mobile Device',
  laptop_tablet: 'Laptop & Tablet',
  circuit_board: 'Circuit Board',
  battery: 'Battery',
  other: 'Other / Unclassified'
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateCategory } = useApi();
  
  // Extract data passed from dashboard
  const initialData = location.state?.data;
  
  const [data, setData] = useState(initialData);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // If no data is available (user navigated directly), kick them back to dashboard
  if (!data) {
    navigate('/dashboard');
    return null;
  }

  const { submission, buyers } = data;
  const isLowConfidence = submission.ai_confidence < 0.4;
  const currentCategory = submission.user_category || submission.ai_category;

  const handleCategoryChange = async (e) => {
    const newCategory = e.target.value;
    if (newCategory === currentCategory) return;
    
    setUpdating(true);
    setError('');
    
    try {
      const result = await updateCategory(submission.id, newCategory);
      setData(result);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update category. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-16 flex flex-col items-center text-white font-body selection:bg-white/30">
      <div className="w-full max-w-4xl animate-fade-in">
        
        {/* Results Header Section */}
        <div className="text-center mb-10">
          <h2 className="font-heading italic text-5xl tracking-[-1px] mb-6">Classification Results</h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="liquid-glass-strong px-5 py-2 rounded-full text-sm font-medium tracking-wide">
              {FORMAT_CATEGORIES[currentCategory]}
            </span>
            
            <span className={`px-5 py-2 rounded-full text-sm font-medium border ${isLowConfidence ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'liquid-glass border-white/20'}`}>
              {Math.round(submission.ai_confidence * 100)}% Confidence
            </span>
          </div>
          
          {isLowConfidence && (
            <p className="text-red-300 text-sm font-light mt-2 max-w-md mx-auto">
              Our AI isn't very confident about this classification. You can correct it below.
            </p>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mt-6 text-sm">
              {error}
            </div>
          )}
          
          {/* Override Form */}
          <div className="liquid-glass rounded-3xl p-6 mt-8 max-w-md mx-auto">
            <label className="block text-sm text-white/70 font-light mb-2">Correct Category (Override AI)</label>
            <div className="relative">
              <select 
                value={currentCategory} 
                onChange={handleCategoryChange}
                disabled={updating}
                className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-white/50 transition-colors"
              >
                {Object.entries(FORMAT_CATEGORIES).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            {updating && <p className="text-white/50 text-xs mt-3">Updating matches...</p>}
          </div>
        </div>

        {/* Buyers Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
            <h3 className="font-heading italic text-3xl tracking-tight">Matched Buyers</h3>
            <span className="liquid-glass px-3 py-1 rounded-full text-xs font-medium">{buyers.length} Found</span>
          </div>
          
          {buyers.length === 0 ? (
            <div className="liquid-glass rounded-3xl p-10 text-center flex flex-col items-center">
              <div className="text-5xl mb-4 opacity-50">🤷</div>
              <h3 className="text-xl font-medium mb-2">No buyers found</h3>
              <p className="text-white/50 font-light text-sm">We couldn't find any buyers accepting this category right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyers.map(buyer => (
                <div key={buyer.id} className="liquid-glass rounded-3xl p-6 flex flex-col h-full">
                  <h4 className="text-lg font-medium mb-4">{buyer.name}</h4>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {buyer.accepted_categories.map(cat => (
                      <span key={cat} className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] text-white/80 uppercase tracking-wider">
                        {FORMAT_CATEGORIES[cat]}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto space-y-2 mb-6 text-sm text-white/70 font-light">
                    {buyer.location_city && <div className="flex items-center gap-2"><span>📍</span> {buyer.location_city}</div>}
                    <div className="flex items-center gap-2"><span>📧</span> <a href={`mailto:${buyer.contact_email}`} className="hover:text-white transition-colors">{buyer.contact_email}</a></div>
                    {buyer.contact_phone && <div className="flex items-center gap-2"><span>📞</span> {buyer.contact_phone}</div>}
                  </div>
                  
                  <button 
                    className="w-full liquid-glass-strong py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                    onClick={() => window.location.href = `mailto:${buyer.contact_email}?subject=E-Waste Query: ${FORMAT_CATEGORIES[currentCategory]}`}
                  >
                    Contact Buyer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Action */}
        <div className="text-center mt-16">
          <button 
            className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2 mx-auto"
            onClick={() => navigate('/dashboard')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Upload Another Item
          </button>
        </div>
      </div>
    </div>
  );
}
