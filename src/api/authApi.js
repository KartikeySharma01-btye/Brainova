import axios from "axios";

/* =========================
   API INSTANCE
========================= */

const API = axios.create({
  baseURL: "https://kartikdgaf-brainova-backend.hf.space",
});

/* =========================
   SIGNUP
========================= */

export const signupUser =
  async (userData) => {

    const response =
      await API.post(
        "/signup",
        userData
      );

    return response.data;
  };

/* =========================
   LOGIN
========================= */

export const loginUser =
  async (userData) => {

    const response =
      await API.post(
        "/login",
        userData
      );

    return response.data;
  };