import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MessageSquare,
  Plus,
  Search,
  FileText,
  Trash2,
  Pencil,
} from "lucide-react";

import {
  getChats,
  deleteChat,
  renameChat,
} from "../../api/chatApi";

import {
  getFiles,
  deleteFile,
} from "../../api/fileApi";

import useChatStore from "../../store/ChatStore";

function Sidebar() {

  const {
    chats,
    setChats,

    selectedChat,
    setSelectedChat,

    setMessages,
  } = useChatStore();

  const [files, setFiles] =
    useState([]);

  const [search, setSearch] =
    useState("");

  /* =========================
     LOAD CHATS
  ========================= */

  const loadChats =
    async () => {

      try {

        const data =
          await getChats();

        const loadedChats =
          data.chats || [];

        setChats(
          loadedChats
        );
        
        return loadedChats;

      } catch (error) {

        console.error(
          error
        );
        return [];
      }
    };

  /* =========================
     LOAD FILES
  ========================= */

  const loadFiles =
    async () => {

      try {

        const data =
          await getFiles();

        setFiles(
          data.files || []
        );

      } catch (error) {

        console.error(
          error
        );
      }
    };

  /* =========================
     NEW CHAT
  ========================= */

  const handleNewChat =
    () => {

      const newChat = {

        chat_id:
          crypto.randomUUID(),

        title: "",
      };

      setSelectedChat(
        newChat
      );

      setMessages([]);
    };

  /* =========================
     DELETE CHAT
  ========================= */

  const handleDeleteChat =
    async (chatId) => {

      try {

        try {

          await deleteChat(
            chatId
          );

        } catch {}

        const updatedChats =
          chats.filter(
            (chat) =>
              chat.chat_id !==
              chatId
          );

        setChats(
          updatedChats
        );

        if (
          selectedChat
            ?.chat_id ===
          chatId
        ) {

          setSelectedChat(
            null
          );

          setMessages([]);
        }

      } catch (error) {

        console.error(
          error
        );
      }
    };

  /* =========================
     RENAME CHAT
  ========================= */

  const handleRenameChat =
    async (chat) => {

      const newTitle =
        prompt(
          "Rename chat",
          chat.title
        );

      if (
        !newTitle?.trim()
      ) {
        return;
      }

      try {

        try {

          await renameChat(
            chat.chat_id,
            newTitle
          );

        } catch {}

        const updated =
          chats.map((c) =>

            c.chat_id ===
            chat.chat_id

              ? {
                  ...c,
                  title:
                    newTitle,
                }

              : c
          );

        setChats(
          updated
        );

      } catch (error) {

        console.error(
          error
        );
      }
    };

  /* =========================
     DELETE FILE
  ========================= */

  const handleDeleteFile =
    async (filename) => {

      try {
        
        await deleteFile(filename);

        const updated = files.filter(
          (file) => file !== filename
        );

        setFiles(updated);

      } catch (error) {
        console.error(error);
      }
    };

  /* =========================
     FILTER CHATS
  ========================= */

  const filteredChats =
    useMemo(() => {

      return chats.filter(
        (chat) =>

          (
            chat.title ||
            ""
          )

            .toLowerCase()

            .includes(
              search.toLowerCase()
            )
      );

    }, [search, chats]);

  /* =========================
     INITIALIZE & FORCE NEW CHAT
  ========================= */

  useEffect(() => {

    const initialize =
      async () => {

        // Fetch old history so it populates the sidebar list
        await loadChats();

        await loadFiles();

        // FIXED: Regardless of whether existing chats exist or not,
        // we explicitly generate a clean conversation canvas on fresh load/refresh
        handleNewChat();
      };

    initialize();

  }, []);

  /* =========================
     REFRESH EVENTS
  ========================= */

  useEffect(() => {

    const refreshChats =
      () => {

        loadChats();
      };

    const refreshFiles =
      () => {

        loadFiles();
      };

    window.addEventListener(
      "refreshChats",
      refreshChats
    );

    window.addEventListener(
      "refreshFiles",
      refreshFiles
    );

    return () => {

      window.removeEventListener(
        "refreshChats",
        refreshChats
      );

      window.removeEventListener(
        "refreshFiles",
        refreshFiles
      );
    };

  }, []);

  return (
    <div className="
      w-[280px]

      h-full

      bg-[#111111]

      border-r
      border-[#232323]

      flex
      flex-col
    ">

      {/* HEADER */}
      <div className="
        p-4

        border-b
        border-[#232323]

        space-y-3
      ">

        {/* NEW CHAT */}
        <button
          onClick={
            handleNewChat
          }

          className="
            w-full

            flex
            items-center
            justify-center
            gap-2

            px-4
            py-3

            rounded-xl

            bg-[#E8DCCF]

            text-[#121212]

            font-medium

            transition-all

            hover:opacity-90
          "
        >

          <Plus size={18} />

          New Chat

        </button>

        {/* SEARCH */}
        <div className="
          flex
          items-center
          gap-2

          px-3
          py-2.5

          rounded-xl

          bg-[#181818]

          border
          border-[#262626]
        ">

          <Search
            size={16}

            className="
              text-[#666]
            "
          />

          <input
            type="text"

            placeholder="Search chats..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="
              flex-1

              bg-transparent

              outline-none

              text-sm

              text-[#E8DCCF]

              placeholder:text-[#666]
            "
          />

        </div>

      </div>

      {/* CONTENT */}
      <div className="
        flex-1

        flex
        flex-col

        overflow-hidden
      ">

        {/* CHATS */}
        <div className="
          flex-1

          overflow-y-auto

          px-2
          py-3

          min-h-0
        ">

          <p className="
            px-3
            mb-2

            text-[11px]

            uppercase

            tracking-wider

            text-[#666]
          ">
            Chats
          </p>

          <div className="
            space-y-1
          ">

            {filteredChats.map(
              (chat) => (

                <div
                  key={
                    chat.chat_id
                  }

                  onClick={() =>
                    setSelectedChat(
                      chat
                    )
                  }

                  className={`
                    group

                    flex
                    items-center
                    justify-between

                    px-3
                    py-2.5

                    rounded-lg

                    cursor-pointer

                    transition-all

                    ${
                      selectedChat
                        ?.chat_id ===
                      chat.chat_id

                        ? `
                          bg-[#1F1F1F]
                        `

                        : `
                          hover:bg-[#181818]
                        `
                    }
                  `}
                >

                  {/* LEFT */}
                  <div className="
                    flex
                    items-center
                    gap-3

                    min-w-0
                  ">

                    <MessageSquare
                      size={15}

                      className="
                        text-[#777]
                      "
                    />

                    <p className="
                      text-sm

                      text-[#D8D0C8]

                      truncate
                    ">

                      {
                        chat.title ||
                        "New Chat"
                      }

                    </p>

                  </div>

                  {/* ACTIONS */}
                  <div className="
                    flex
                    items-center
                    gap-2

                    opacity-0

                    group-hover:opacity-100

                    transition-all
                  ">

                    {/* Rename */}
                    <button
                      onClick={(e) => {

                        e.stopPropagation();

                        handleRenameChat(
                          chat
                        );
                      }}
                    >

                      <Pencil
                        size={14}

                        className="
                          text-[#666]

                          hover:text-[#E8DCCF]
                        "
                      />

                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => {

                        e.stopPropagation();

                        handleDeleteChat(
                          chat.chat_id
                        );
                      }}
                    >

                      <Trash2
                        size={14}

                        className="
                          text-[#666]

                          hover:text-red-400
                        "
                      />

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* FILES */}
        <div className="
          shrink-0

          px-2
          py-3

          border-t
          border-[#1D1D1D]

          bg-[#111111]
        ">

          <p className="
            px-3
            mb-2

            text-[11px]

            uppercase

            tracking-wider

            text-[#666]
          ">
            Uploaded Files
          </p>

          <div className="
            max-h-[220px]

            overflow-y-auto

            space-y-1
          ">

            {files.length ===
            0 ? (

              <p className="
                px-3
                py-2

                text-sm

                text-[#555]
              ">
                No files uploaded
              </p>

            ) : (

              files.map(
                (
                  file,
                  index
                ) => (

                  <div
                    key={index}

                    className="
                      group

                      flex
                      items-center
                      justify-between

                      px-3
                      py-2.5

                      rounded-lg

                      hover:bg-[#181818]

                      transition-all
                    "
                  >

                    {/* LEFT */}
                    <div className="
                      flex
                      items-center
                      gap-3

                      min-w-0
                    ">

                      <FileText
                        size={15}

                        className="
                          text-[#777]
                        "
                      />

                      <p className="
                        text-sm

                        text-[#D8D0C8]

                        truncate
                      ">

                        {file}

                      </p>

                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDeleteFile(
                          file
                        )
                      }

                      className="
                        opacity-0

                        group-hover:opacity-100

                        transition-all
                      "
                    >

                      <Trash2
                        size={14}

                        className="
                          text-[#666]

                          hover:text-red-400
                        "
                      />

                    </button>

                  </div>

                )
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;