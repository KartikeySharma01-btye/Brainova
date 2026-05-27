import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Sparkles,
} from "lucide-react";

import MessageBubble from "./MessageBubble";

import ChatInput from "./ChatInput";

import {
  sendMessage,
  getChatMessages,
} from "../../api/chatApi";

import useChatStore from "../../store/chatStore";

function ChatWindow() {

  const {
    messages,
    setMessages,
    addMessage,

    selectedChat,
  } = useChatStore();

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  /* =========================
     LOAD MESSAGES
  ========================= */

  useEffect(() => {

    const loadMessages =
      async () => {

        if (!selectedChat) {
          return;
        }

        try {

          const data =
            await getChatMessages(
              selectedChat.chat_id
            );

          const formatted =
            (
              data.messages ||
              []
            ).map((msg) => ({
              role:
                msg.sender ===
                "user"

                  ? "user"

                  : "assistant",

              content:
                msg.message,
            }));

          setMessages(
            formatted
          );

        } catch (error) {

          console.error(
            error
          );
        }
      };

    loadMessages();

  }, [selectedChat]);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {

    messagesEndRef.current?.
      scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSendMessage =
    async (text) => {

      if (
        !text.trim() ||
        !selectedChat
      ) {
        return;
      }

      const userMessage = {
        role: "user",
        content: text,
      };

      addMessage(userMessage);

      try {

        setLoading(true);

        const response =
          await sendMessage(
            text,
            selectedChat.chat_id
          );

        addMessage({
          role: "assistant",

          content:
            response ||
            "No response",
        });

        window.dispatchEvent(
          new Event(
            "refreshChats"
          )
        );

      } catch (error) {

        console.error(
          error
        );

        addMessage({
          role: "assistant",

          content:
            "Something went wrong while generating response.",
        });

      } finally {

        setLoading(false);
      }
    };

  /* =========================
     SUGGESTIONS
  ========================= */

  const suggestions = [

    "Summarize my uploaded PDFs",

    "Explain operating systems",

    "Generate startup ideas",

    "Help me prepare for interviews",
  ];

  return (
    <div className="
      flex-1

      h-full

      flex
      flex-col

      bg-[#0E0E0E]

      relative
    ">

      {/* MESSAGES */}
      <div className="
        flex-1

        overflow-y-auto

        px-6
        py-10
      ">

        {/* EMPTY STATE */}
        {messages.length ===
        0 ? (

          <div className="
            h-full

            flex
            items-center
            justify-center
          ">

            <div className="
              w-full

              max-w-3xl

              mx-auto

              text-center
            ">

              {/* ICON */}
              <div className="
                w-20
                h-20

                rounded-3xl

                mx-auto
                mb-8

                flex
                items-center
                justify-center

                bg-[#E8DCCF]

                shadow-2xl
              ">

                <Sparkles
                  size={32}

                  className="
                    text-black
                  "
                />

              </div>

              {/* TITLE */}
              <h1 className="
                text-6xl

                font-semibold

                tracking-tight

                text-[#E8DCCF]

                mb-4
              ">

                How can I help you?

              </h1>

              {/* SUBTITLE */}
              <p className="
                text-lg

                text-[#8A8178]

                mb-12
              ">

                Ask anything, upload files,
                or explore your data.

              </p>

              {/* SUGGESTIONS */}
              <div className="
                grid
                grid-cols-2

                gap-4

                max-w-2xl

                mx-auto
              ">

                {suggestions.map(
                  (
                    item,
                    index
                  ) => (

                    <button
                      key={index}

                      onClick={() =>
                        handleSendMessage(
                          item
                        )
                      }

                      className="
                        text-left

                        px-5
                        py-4

                        rounded-2xl

                        bg-[#161616]

                        border
                        border-[#262626]

                        text-[#D8D0C8]

                        hover:bg-[#1E1E1E]

                        hover:border-[#333]

                        transition-all
                      "
                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>

          </div>

        ) : (

          <div className="
            max-w-4xl

            mx-auto

            space-y-8
          ">

            {messages.map(
              (
                message,
                index
              ) => (

                <MessageBubble
                  key={index}

                  message={
                    message
                  }
                />

              )
            )}

            {loading && (

              <div className="
                text-[#777]

                text-sm
              ">
                Brainova is thinking...
              </div>

            )}

            <div
              ref={
                messagesEndRef
              }
            />

          </div>

        )}

      </div>

      {/* FLOATING INPUT */}
      <div className="
        sticky
        bottom-0

        px-6
        pb-6
      ">

        <div className="
          max-w-4xl

          mx-auto
        ">

          <ChatInput
            onSend={
              handleSendMessage
            }

            disabled={
              loading
            }

            onUploadSuccess={
              () => {

                window.dispatchEvent(
                  new Event(
                    "refreshFiles"
                  )
                );
              }
            }
          />

        </div>

      </div>

    </div>
  );
}

export default ChatWindow;
