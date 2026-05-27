import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function ProtectedRoute({
  children,
}) {

  const {
    isAuthenticated,
    loading,
  } = useAuth();

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <div className="
        h-screen

        bg-[#121212]

        flex
        items-center
        justify-center

        text-[#E8DCCF]
      ">

        Loading...

      </div>
    );
  }

  /* =========================
     NOT AUTHENTICATED
  ========================= */

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* =========================
     AUTHENTICATED
  ========================= */

  return children;
}

export default ProtectedRoute;