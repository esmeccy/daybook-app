import axios from "axios";

const API_URL = "http://localhost:3000";

// every /entries route is protected server-side, so attach the token to all requests in one place
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// tokens expire after an hour. without this the app still sees a token in localStorage
// and shows the UI, but every request comes back 403 and it just looks broken.
// 401 and 403 only ever come from the auth middleware, so either one means the session is dead.
// the sign-in and sign-up forms use fetch, not axios, so a wrong password never lands here.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // localStorage only holds the token, username, and email, so clearing it is the whole sign-out
      localStorage.clear();
      // a full reload instead of navigate(), so no stale signed-in state survives anywhere in the tree
      window.location.assign("/sign-in");
    }
    return Promise.reject(error);
  }
);

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
