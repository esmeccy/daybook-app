import axios from "axios";

const API_URL = "http://localhost:3000";

// every /entries route is protected server-side, so attach the token to all requests in one place
// ponytail: token in localStorage — simplest thing that survives a refresh, swap for an httpOnly cookie if this ever ships
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signIn = (email, password) =>
  axios.post(`${API_URL}/user/sign-in`, { email, password });

export const signUp = (username, email, password) =>
  axios.post(`${API_URL}/user/sign-up`, { username, email, password });

export const imageUrl = (filename) =>
  `${API_URL}/uploads/${encodeURIComponent(filename.trim())}`;

export const getEntries = () => axios.get(`${API_URL}/entries`);
export const getEntry = (id) => axios.get(`${API_URL}/entries/${id}`);
export const createEntry = (formData) => axios.post(`${API_URL}/entries`, formData);
export const updateEntry = (id, formData) => axios.put(`${API_URL}/entries/${id}`, formData);
export const deleteEntry = (id) => axios.delete(`${API_URL}/entries/${id}`);
export const getCategories = () => axios.get(`${API_URL}/categories`);

//format the date to the locale date string
export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";
