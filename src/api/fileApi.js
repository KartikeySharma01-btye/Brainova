import api from "./axios";

/* =========================
   GET FILES
========================= */

export const getFiles =
  async () => {

    const response =
      await api.get(
        "/files"
      );

    return response.data;
  };

/* =========================
   UPLOAD FILE
========================= */

export const uploadFile =
  async (file) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await api.post(
        "/upload",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

/* =========================
   DELETE FILE
========================= */

export const deleteFile =
  async (filename) => {

    // Target the path but add an explicit string fallback or trailing slash match
    const response =
      await api.delete(
        `/delete/${encodeURIComponent(filename)}`
      );

    return response.data;
  };