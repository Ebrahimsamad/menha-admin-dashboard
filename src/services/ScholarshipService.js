import axios from "axios";

const API_URL = "https://menha-backend.vercel.app/scholarship";

const fetchScholarships = async () => {
  const response = await axios.get(API_URL);
  return response.data.scholarships || [];
};

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

const ScholarshipService = {
  fetchScholarships,
  deleteScholarship,
};

export default ScholarshipService;
