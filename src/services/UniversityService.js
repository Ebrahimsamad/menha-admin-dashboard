import axios from "axios";

const BASE_URL = "https://menha-backend.vercel.app/university";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const fetchUniversities = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get(
    `/pagination?page=${page}&limit=${limit}`
  );
  return response.data;
};

const createUniversity = async (universityData) => {
  const response = await axiosInstance.post("/", universityData);
  return response.data;
};

const editUniversity = async (id, universityData) => {
  const response = await axiosInstance.put(`/${id}`, universityData);
  return response.data;
};

const deleteUniversity = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

export default {
  fetchUniversities,
  createUniversity,
  editUniversity,
  deleteUniversity,
};
