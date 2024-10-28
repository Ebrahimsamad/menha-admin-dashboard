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

const createUniversity = async (formData) => {
  const response = await axiosInstance.post("/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const editUniversity = async (id, formData) => {
  try {
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await axiosInstance.patch(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to edit university: ${errorMessage}`);
  }
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
