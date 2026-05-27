import {
  Sparkles,
  LogOut,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

function Navbar() {

  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  /* =========================
     HANDLE LOGOUT
  ========================= */

 const handleLogout = () => {

  logout();

  window.location.href = "/login";
};

  return (
    <div className="
      h-16

      px-6

      border-b
      border-[#262626]

      bg-[#171717]

      flex
      items-center
      justify-between
    ">

      {/* LEFT */}
      <div className="
        flex
        items-center
        gap-4
      ">

        {/* Logo */}
        <div className="
          w-11
          h-11

          rounded-2xl

          bg-[#E8DCCF]

          flex
          items-center
          justify-center

          text-[#121212]
        ">

          <Sparkles
            size={20}
          />

        </div>

        {/* Text */}
        <div>

          <h1 className="
            text-xl
            font-semibold

            text-[#E8DCCF]
          ">
            Brainova AI
          </h1>

          <p className="
            text-xs

            text-[#777]
          ">
            AI Workspace
          </p>

        </div>

      </div>

      {/* RIGHT */}
      <button
        onClick={
          handleLogout
        }

        className="
          flex
          items-center
          gap-2

          px-4
          py-2.5

          rounded-xl

          bg-[#1F1F1F]

          border
          border-[#2A2A2A]

          text-[#E8DCCF]

          transition-all

          hover:bg-[#252525]
        "
      >

        <LogOut
          size={16}
        />

        Logout

      </button>

    </div>
  );
}

export default Navbar;