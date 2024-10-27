const API_URL = 'https://menha-backend.vercel.app';

export const getAllLanguages = async () => {
  try {
    const response = await fetch(`${API_URL}/language`);
    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

export const addLanguage = async (newLanguage) => {
  try {
    const response = await fetch(`${API_URL}/language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLanguage),
    });
    if (!response.ok) {
      throw new Error('Failed to add new language');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding language:', error);
    throw error;
  }
};

export const editLanguage = async (id, updatedLanguage, token) => {
  try {
    const response = await fetch(`${API_URL}/language/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedLanguage),
    });
    if (!response.ok) {
      throw new Error('Failed to update language');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating language:', error);
    throw error;
  }
};

export const deleteLanguage = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/language/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete language');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting language:', error);
    throw error;
  }
};