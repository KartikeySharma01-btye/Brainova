import axios from "axios";

/* =========================
   API INSTANCE
========================= */

const API = axios.create({
  baseURL: "https://kartikdgaf-brainova-backend.hf.space",
});

/* =========================
   AUTH INTERCEPTOR
========================= */

API.interceptors.request.use(

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

/* =========================
   GET CHATS
========================= */

export const getChats =
  async () => {

    const response =
      await API.get(
        "/chats"
      );

    return response.data;
  };

/* =========================
   GET CHAT HISTORY
========================= */

export const getChatMessages =
  async (chatId) => {

    const response =
      await API.get(
        `/chat/${chatId}`
      );

    return response.data;
  };

/* =========================
   SEND MESSAGE
========================= */

export const sendMessage =
  async (
    message,
    chatId
  ) => {

    const response =
      await API.post(
        "/chat",
        {
          text: message,
          chat_id: chatId,
        },
        {
          responseType:
            "text",
        }
      );

    return response.data;
  };

/* =========================
   DELETE CHAT
========================= */

export const deleteChat =
  async (chatId) => {

    const response =
      await API.delete(
        `/chat/${chatId}`
      );

    return response.data;
  };

/* =========================
   RENAME CHAT
========================= */

export const renameChat =
  async (
    chatId,
    title
  ) => {

    const response =
      await API.put(
        `/chat/${chatId}`,
        {
          title,
        }
      );

    return response.data;
  };