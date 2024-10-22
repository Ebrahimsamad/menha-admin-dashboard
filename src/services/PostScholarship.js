const API_URL = 'https://menha-backend.vercel.app';

export const postScholarship = async (FinalCombinedData, token) => {
  try {
    const response = await fetch(`${API_URL}/scholarship`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(FinalCombinedData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add new shcolarship');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding new scholarship:', error);
    throw error;
  }
};
