import { apiRequest } from "./api";

export const loginUser = (credentials) => apiRequest("/api/auth/login", "POST", credentials);
export const signupUser = (credentials) => apiRequest("/api/auth/signup", "POST", credentials);
