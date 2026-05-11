import axios from "axios";

export const api = axios.create({
  baseURL: "https://zmcoachingbackend.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export const sendCoachAiMessage = async (message: string) => {
  const res = await api.post("/ai/chat", { message });
  return res.data;
};