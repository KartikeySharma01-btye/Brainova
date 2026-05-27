import ReactMarkdown
from "react-markdown";

import remarkGfm
from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Bot,
  User,
  Copy,
  Check,
} from "lucide-react";

import {
  useState,
} from "react";

function MessageBubble({
  message,
}) {

  const isUser =
    message.role ===
    "user";

  const [copied,
    setCopied] =
    useState(false);

  /* =========================
     COPY MESSAGE
  ========================= */

  const copyMessage =
    async () => {

      await navigator
        .clipboard
        .writeText(
          message.content
        );

      setCopied(true);

      setTimeout(() => {

        setCopied(false);

      }, 2000);
    };

  return (
    <div className={`
      flex

      ${
        isUser

          ? `
            justify-end
          `

          : `
            justify-start
          `
      }
    `}>

      <div className={`
        group

        max-w-[85%]

        rounded-3xl

        px-5
        py-4

        relative

        ${
          isUser

            ? `
              bg-[#E8DCCF]
              text-black
            `

            : `
              bg-[#161616]
              text-[#E7E0D8]

              border
              border-[#262626]
            `
        }
      `}>

        {/* TOP */}
        <div className="
          flex
          items-center
          gap-2

          mb-4
        ">

          {/* ICON */}
          <div className={`
            w-8
            h-8

            rounded-full

            flex
            items-center
            justify-center

            ${
              isUser

                ? `
                  bg-black/10
                `

                : `
                  bg-[#222]
                `
            }
          `}>

            {isUser ? (

              <User size={16} />

            ) : (

              <Bot size={16} />

            )}

          </div>

          {/* LABEL */}
          <p className="
            text-sm
            font-medium
          ">

            {isUser
              ? "You"
              : "Brainova AI"}

          </p>

        </div>

        {/* CONTENT */}
        <div className="
          prose
          prose-invert

          max-w-none

          prose-p:leading-7

          prose-pre:p-0

          prose-code:text-[#E8DCCF]

          prose-strong:text-white

          prose-headings:text-white
        ">

          <ReactMarkdown
            remarkPlugins={[
              remarkGfm
            ]}

            components={{

              code({
                inline,
                className,
                children,
                ...props
              }) {

                const match =
                  /language-(\w+)/.exec(
                    className || ""
                  );

                return !inline &&
                  match ? (

                  <SyntaxHighlighter
                    style={
                      oneDark
                    }

                    language={
                      match[1]
                    }

                    PreTag="div"

                    customStyle={{
                      borderRadius:
                        "16px",

                      padding:
                        "18px",

                      fontSize:
                        "14px",
                    }}

                    {...props}
                  >

                    {String(
                      children
                    ).replace(
                      /\n$/,
                      ""
                    )}

                  </SyntaxHighlighter>

                ) : (

                  <code
                    className="
                      bg-black/30

                      px-1.5
                      py-0.5

                      rounded

                      text-sm
                    "

                    {...props}
                  >

                    {children}

                  </code>

                );
              },
            }}
          >

            {message.content}

          </ReactMarkdown>

        </div>

        {/* COPY BUTTON */}
        {!isUser && (

          <button
            onClick={
              copyMessage
            }

            className="
              absolute

              top-4
              right-4

              opacity-0

              group-hover:opacity-100

              transition-all

              p-2

              rounded-lg

              hover:bg-white/5
            "
          >

            {copied ? (

              <Check
                size={16}
              />

            ) : (

              <Copy
                size={16}
              />

            )}

          </button>

        )}

      </div>

    </div>
  );
}

export default MessageBubble;