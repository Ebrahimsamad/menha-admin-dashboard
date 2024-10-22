
const API_URL = 'https://menha-backend.vercel.app';
export const AddFieldOfStudy =async (fieldOfStudy,token) => {
    try {
      console.log("this is fieldofstudy",fieldOfStudy)
        const response = await fetch(`${API_URL}/field-of-study`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fieldOfStudy),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error response:', errorData);
      
          const errorMessage = errorData.message || 'Failed to add field of study';
          throw new Error(errorMessage);
      }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error adding field of study', error);
        throw error;
      }
}
