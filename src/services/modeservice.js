const API_URL = 'https://menha-backend.vercel.app';

export const getAllModesOfStudy = async () => {
  try {
    const response = await fetch(`${API_URL}/mode-of-study`);
    if (!response.ok) {
      throw new Error('Failed to fetch modes of study');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching modes of study:', error);
    throw error;
  }
};

export const deleteModeOfStudyById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/mode-of-study/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete mode of study');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting mode of study:', error);
    throw error;
  }
};
