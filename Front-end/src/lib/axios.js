import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    // import.meta.env.MODE === "development"
    //   ? "http://localhost:3000/api"
    "https://chween-bfz7.onrender.com/api",
  withCredentials: true,
});
