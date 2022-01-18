import axios from "axios";

export const API_BASE_URL =
    'http://localhost:3001' || process.env.REACT_APP_URL;

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});