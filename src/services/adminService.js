const BASE_URL = "https://menha-backend.vercel.app";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Please log in.");
  }
  return token;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    throw new Error("Token expired");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
  }

  return response.json();
};

const adminService = {
  getAllAdmins: async () => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleResponse(response);

      return data.admins || [];
    } catch (error) {
      throw error;
    }
  },

  createAdmin: async (adminData) => {
    try {
      const token = getToken();
      const obj = Object.fromEntries(adminData);

      const response = await fetch(`${BASE_URL}/admin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await handleResponse(response);

      return data.user;
    } catch (error) {
      throw error;
    }
  },

  updateAdmin: async (adminId, adminData) => {
    try {
      const token = getToken();
      const obj = Object.fromEntries(adminData);

      const response = await fetch(`${BASE_URL}/admin/${adminId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      const data = await handleResponse(response);
      
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  deleteAdmin: async (adminId) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/admin/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await handleResponse(response);
      return true;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(`${BASE_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await handleResponse(response);
      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.token;
    } catch (error) {
      
      throw error;
    }
  },
};
export default adminService;
