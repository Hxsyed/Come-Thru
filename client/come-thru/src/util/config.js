import axios from "axios";

export const API_BASE_URL =
    process.env.REACT_APP_BACKEND_SERVICE_URL;

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});