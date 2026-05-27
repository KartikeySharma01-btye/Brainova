import axios from "axios";

const api = axios.create({

  baseURL:
    "https://kartikdgaf-brainova-backend.hf.space/",

  headers: {
    "Content-Type":
      "application/json",
  },
});

/* =========================
   AUTH TOKEN
========================= */

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(
      error
    );
  }
);

export default api;