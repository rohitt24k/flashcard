import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://flashcard-backend-yxfv.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
