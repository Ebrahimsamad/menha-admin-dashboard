const API_URL = 'https://menha-backend.vercel.app';

export const getAllCourseTypes = async () => {
  try {
    const response = await fetch(`${API_URL}/course-type`);
    if (!response.ok) {
      throw new Error('Failed to fetch course types');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching course types:', error);
    throw error;
  }
};

export const deleteCourseTypeById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/course-type/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete course type');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting course type:', error);
    throw error;
  }
};
