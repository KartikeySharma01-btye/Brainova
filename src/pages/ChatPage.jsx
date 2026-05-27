import {
  useState,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

function ChatPage() {

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  return (
    <div className="
      h-screen

      bg-[#0E0E0E]

      overflow-hidden
    ">

      {/* TOPBAR MOBILE */}
      <div className="
        md:hidden

        h-14

        flex
        items-center
        justify-between

        px-4

        border-b
        border-[#222]

        bg-[#111]
      ">

        <button
          onClick={() =>
            setSidebarOpen(
              true
            )
          }
        >

          <Menu
            size={22}

            className="
              text-[#E8DCCF]
            "
          />

        </button>

        <h1 className="
          text-[#E8DCCF]

          font-semibold
        ">
          Brainova
        </h1>

        <div />
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="
        hidden
        md:block
      ">
        <Navbar />
      </div>

      <div className="
        flex

        h-[calc(100vh-56px)]

        md:h-[calc(100vh-64px)]
      ">

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (

          <div
            onClick={() =>
              setSidebarOpen(
                false
              )
            }

            className="
              fixed
              inset-0

              bg-black/60

              z-40

              md:hidden
            "
          />

        )}

        {/* SIDEBAR */}
        <div className={`
          fixed
          md:static

          top-0
          left-0

          z-50

          h-screen
          md:h-auto

          transition-transform
          duration-300

          ${
            sidebarOpen

              ? `
                translate-x-0
              `

              : `
                -translate-x-full
                md:translate-x-0
              `
          }
        `}>

          {/* CLOSE BUTTON MOBILE */}
          <div className="
            md:hidden

            absolute
            top-4
            right-4

            z-50
          ">

            <button
              onClick={() =>
                setSidebarOpen(
                  false
                )
              }
            >

              <X
                size={22}

                className="
                  text-white
                "
              />

            </button>

          </div>

          <Sidebar
            closeSidebar={() =>
              setSidebarOpen(
                false
              )
            }
          />

        </div>

        {/* CHAT */}
        <div className="
          flex-1

          min-w-0
        ">

          <ChatWindow />

        </div>

      </div>

    </div>
  );
}

export default ChatPage;