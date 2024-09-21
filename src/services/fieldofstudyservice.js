const API_URL = 'https://menha-backend.vercel.app';

export const getAllFieldOfStudy = async () => {
  try {
    const response = await fetch(`${API_URL}/field-of-study`);
    if (!response.ok) {
      throw new Error('Failed to fetch fields of study');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching fields of study:', error);
    throw error;
  }
};

export const deleteFieldOfStudy = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/field-of-study/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete field of study');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting field of study:', error);
    throw error;
  }
};
