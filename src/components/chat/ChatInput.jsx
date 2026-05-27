import {
  useState,
} from "react";

import {
  Send,
} from "lucide-react";

import FileUpload from "../files/FileUpload.jsx";

function ChatInput({
  onSend,
  disabled,
  onUploadSuccess,
}) {

  const [message, setMessage] =
    useState("");

  /* =========================
     SEND
  ========================= */

  const handleSend =
    () => {

      if (
        !message.trim()
      ) {
        return;
      }

      onSend(message);

      setMessage("");
    };

  /* =========================
     ENTER
  ========================= */

  const handleKeyDown =
    (e) => {

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {

        e.preventDefault();

        handleSend();
      }
    };

  return (
    <div className="
      w-full
    ">

      <div className="
        flex
        items-end
        gap-3

        p-3

        rounded-3xl

        border
        border-[#2A2A2A]

        bg-[#1A1A1A]
      ">

        {/* Upload */}
        <FileUpload
          onUploadSuccess={
            onUploadSuccess
          }
        />

        {/* Input */}
        <textarea
          rows={1}

          value={message}

          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }

          onKeyDown={
            handleKeyDown
          }

          placeholder="
Message Brainova AI...
          "

          disabled={disabled}

          className="
            flex-1

            resize-none

            bg-transparent

            text-[#E8DCCF]

            placeholder:text-[#666]

            outline-none

            text-sm

            max-h-40

            py-2
          "
        />

        {/* Send */}
        <button
          onClick={
            handleSend
          }

          disabled={
            disabled ||
            !message.trim()
          }

          className={`
            w-11
            h-11

            rounded-2xl

            flex
            items-center
            justify-center

            transition-all

            ${
              disabled ||
              !message.trim()

                ? `
                  bg-[#232323]
                  text-[#555]

                  cursor-not-allowed
                `

                : `
                  bg-[#E8DCCF]
                  text-[#121212]

                  hover:scale-105
                `
            }
          `}
        >

          <Send
            size={18}
          />

        </button>

      </div>

    </div>
  );
}

export default ChatInput;