const BASE_URL = 'https://menha-backend.vercel.app';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const portfolioService = {
 
  getAllPortfolios: async () => {
    try {
      const response = await fetch(`${BASE_URL}/portfolio`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  acceptPortfolio: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/portfolio/accept/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  rejectPortfolio: async (id, message) => {
    try {
      const response = await fetch(`${BASE_URL}/portfolio/reject/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectMessage: message }), 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
    
      throw error;
    }
  }
};

export default portfolioService;
