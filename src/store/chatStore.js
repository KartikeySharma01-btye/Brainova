import { create } from "zustand";

const useChatStore = create((set) => ({

  /* =========================
     STATES
  ========================= */

  chats: [],

  selectedChat: null,

  messages: [],

  loading: false,

  /* =========================
     SET CHATS
  ========================= */

  setChats: (chats) =>
    set({
      chats,
    }),

  /* =========================
     SET SELECTED CHAT
  ========================= */

  setSelectedChat: (chat) =>
    set({
      selectedChat: chat,
    }),

  /* =========================
     SET MESSAGES
  ========================= */

  setMessages: (messages) =>
    set({
      messages,
    }),

  /* =========================
     ADD MESSAGE
  ========================= */

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        message,
      ],
    })),

  /* =========================
     SET LOADING
  ========================= */

  setLoading: (loading) =>
    set({
      loading,
    }),

  /* =========================
     RESET CHAT
  ========================= */

  resetChat: () =>
    set({
      selectedChat: null,
      messages: [],
    }),

}));

export default useChatStore;