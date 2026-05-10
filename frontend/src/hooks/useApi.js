import { useAuth } from '@clerk/react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useApi = () => {
  const { getToken } = useAuth();

  // We explicitly attach tokens to requests to avoid Axios config merging bugs

  const uploadImage = async (file) => {
    const token = await getToken();
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const updateCategory = async (submissionId, category) => {
    const token = await getToken();
    const response = await axios.patch(`${API_URL}/submissions/${submissionId}/category`, { category }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  return { uploadImage, updateCategory };
};
