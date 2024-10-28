const API_URL = 'https://menha-backend.vercel.app';


export const updatePortfolio = async (FinalCombinedData,id, token) => {
  try {
    const response = await fetch(`${API_URL}/scholarship/${id}`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(FinalCombinedData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add new Scholarship');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding new Scholarship:', error);
    throw error;
  }
};
