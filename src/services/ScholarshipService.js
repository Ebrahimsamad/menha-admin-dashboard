import axios from "axios";

// Define the base URL for the scholarship API
const API_URL = "https://menha-backend.vercel.app/scholarship";

// Fetch scholarships with pagination
const fetchScholarships = async (page = 1, size = 10) => {
  const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
  return response.data;
};

// Search scholarships by title and university
const fetchScholarshipsSearch = async (query) => {
  const { title, university } = query;
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (university) params.append("university", university);

  try {
    const response = await axios.get(`${API_URL}/search?${params.toString()}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};

// Delete a scholarship by ID
const deleteScholarship = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Edit a scholarship by ID
const editScholarship = async (id, updatedData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await axios.put(`${API_URL}/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Export the scholarship service methods
const ScholarshipService = {
  fetchScholarships,
  deleteScholarship,
  editScholarship,
  fetchScholarshipsSearch,
};

export default ScholarshipService;
