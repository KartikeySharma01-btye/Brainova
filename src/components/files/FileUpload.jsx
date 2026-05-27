import {
  useRef,
  useState,
} from "react";

import {
  Upload,
  Loader2,
} from "lucide-react";

import {
  uploadFile,
} from "../../api/fileApi";

function FileUpload({
  onUploadSuccess,
}) {

  const inputRef =
    useRef(null);

  const [loading, setLoading] =
    useState(false);

  /* =========================
     HANDLE FILE
  ========================= */

  const handleFileChange =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) {
        return;
      }

      try {

        setLoading(true);

        await uploadFile(
          file
        );

        /* UPDATE SIDEBAR */
        if (
          onUploadSuccess
        ) {

          onUploadSuccess(
            file.name
          );
        }

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);

        e.target.value =
          "";
      }
    };

  return (
    <div>

      {/* INPUT */}
      <input
        ref={inputRef}

        type="file"

        onChange={
          handleFileChange
        }

        className="
          hidden
        "
      />

      {/* BUTTON */}
      <button
        onClick={() =>
          inputRef.current.click()
        }

        disabled={loading}

        className="
          w-10
          h-10

          rounded-xl

          flex
          items-center
          justify-center

          bg-[#232323]

          text-[#E8DCCF]

          hover:bg-[#2A2A2A]

          transition-all
        "
      >

        {loading ? (

          <Loader2
            size={16}

            className="
              animate-spin
            "
          />

        ) : (

          <Upload
            size={16}
          />

        )}

      </button>

    </div>
  );
}

export default FileUpload;