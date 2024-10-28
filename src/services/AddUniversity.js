const API_URL = 'https://menha-backend.vercel.app';

export const adduniversity = async (universityFormData, token) => {
  try {
    const response = await fetch(`${API_URL}/university`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',
      },
      //  body: JSON.stringify(universityFormData),
       body: universityFormData,

    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add new university');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding university:', error);
    throw error;
  }
};
