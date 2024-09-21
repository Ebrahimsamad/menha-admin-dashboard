const BASE_URL = "https://menha-backend.vercel.app"; 
const token = localStorage.getItem('token');

// if (!token) { 
//   throw new Error('User is not authenticated. Please log in.'); 
// }

const adminService = {
  getAllAdmins: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      console.log("Admins List: ", data.admins);
      return data.admins || [];
    } catch (error) {
      if (error.status === 401) {
        error.message = 'Not authorized';
      }
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  createAdmin: async (adminData) => {
    try {
      const obj = {};
      adminData.forEach((value, key) => {
        obj[key] = value;
      });

      const response = await fetch(`${BASE_URL}/admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const newAdmin = await response.json();
      console.log("New Admin Created: ", newAdmin.user);
      return newAdmin.user;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  updateAdmin: async (adminId, adminData) => {
    try {
      const obj = {};
      adminData.forEach((value, key) => {
        obj[key] = value;
      });

      const response = await fetch(`${BASE_URL}/admin/${adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const updatedAdmin = await response.json();
      console.log("Updated Admin: ", updatedAdmin);
      return updatedAdmin.user;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  deleteAdmin: async (adminId) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      console.log(`Admin with ID ${adminId} deleted successfully.`);
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }
};

export default adminService;
