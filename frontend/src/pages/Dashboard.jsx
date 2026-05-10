import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function Dashboard() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const { uploadImage } = useApi();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    setError('');
    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError('Only JPEG and PNG images are allowed.');
      return;
    }
    
    setFile(selectedFile);
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await uploadImage(file);
      navigate('/results', { state: { data } });
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.error || 'Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-28 px-4 flex justify-center text-white font-body selection:bg-white/30">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="font-heading italic text-5xl tracking-[-1px] mb-3">Identify E-Waste</h2>
          <p className="text-white/70 font-light">Upload an image to get AI classification and buyer matches.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {!preview ? (
          <div 
            className={`relative w-full h-80 liquid-glass rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 ${dragOver ? 'border-white/50 bg-white/10' : 'border-transparent hover:bg-white/5'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-5xl mb-4 opacity-80">📥</div>
            <h3 className="text-xl font-medium mb-2">Drag & Drop</h3>
            <p className="text-sm text-white/50 font-light">or click to browse your files (JPEG, PNG up to 10MB)</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              accept="image/jpeg, image/png"
              className="hidden" 
            />
          </div>
        ) : (
          <div className="liquid-glass rounded-3xl p-6 text-center">
            <div className="relative w-full h-72 mb-6 rounded-2xl overflow-hidden">
              <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center py-4">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-light text-white/80">Analyzing image using AI...</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
                <button 
                  className="px-6 py-3 rounded-full text-sm font-medium border border-white/20 hover:bg-white/10 transition-colors" 
                  onClick={clearSelection}
                >
                  Try Another
                </button>
                <button 
                  className="liquid-glass-strong px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors" 
                  onClick={handleSubmit}
                >
                  Analyze Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
