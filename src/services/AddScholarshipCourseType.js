const API_URL = 'https://menha-backend.vercel.app';

export const addCourseType = async (courseType, token) => {
  try {
    const response = await fetch(`${API_URL}/course-type`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseType),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add course type');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding course type:', error);
    throw error;
  }
};
