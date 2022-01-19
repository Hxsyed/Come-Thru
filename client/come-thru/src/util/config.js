import axios from "axios";

export const API_BASE_URL =
    process.env.REACT_APP_URL ;
    // || 'http://localhost:3001

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});