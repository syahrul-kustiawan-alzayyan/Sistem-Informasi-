import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const submitForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/submit-form`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};