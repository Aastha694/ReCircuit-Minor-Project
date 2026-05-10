import { useAuth } from '@clerk/react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useApi = () => {
  const { getToken } = useAuth();

  const getClient = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  const uploadImage = async (file) => {
    const client = await getClient();
    const formData = new FormData();
    formData.append('image', file);
    
    // Explicitly set content-type for multipart
    const response = await client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };

  const updateCategory = async (submissionId, category) => {
    const client = await getClient();
    const response = await client.patch(`/submissions/${submissionId}/category`, { category });
    return response.data;
  };

  return { uploadImage, updateCategory };
};
