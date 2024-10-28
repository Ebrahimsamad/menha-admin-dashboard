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
export const editCourseTypeById = async (id, data, token) => {
  try {
    const response = await fetch(`${API_URL}/course-type/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to edit course type');
    }
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error('Error editing course type:', error);
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
