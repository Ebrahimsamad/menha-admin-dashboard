const API_URL = 'https://menha-backend.vercel.app';

export const addlanguage = async (languageData, token) => {
  try {
    
    const response = await fetch(`${API_URL}/language`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
      },
        body: JSON.stringify(languageData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add new Language');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding Language', error);
    throw error;
  }
};
