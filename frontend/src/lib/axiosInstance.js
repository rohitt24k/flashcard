import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://flashcard-henna-one.vercel.app/api",
  withCredentials: true,
});

export default axiosInstance;
