import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* =========================
   CONTEXT
========================= */

const AuthContext =
  createContext();

/* =========================
   PROVIDER
========================= */

export function AuthProvider({
  children,
}) {

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     CHECK TOKEN
  ========================= */

  useEffect(() => {

    const storedToken =
      localStorage.getItem(
        "token"
      );

    if (storedToken) {

      setToken(
        storedToken
      );
    }

    setLoading(false);

  }, []);

  /* =========================
     LOGIN
  ========================= */

  const login =
    (newToken) => {

      localStorage.setItem(
        "token",
        newToken
      );

      setToken(
        newToken
      );
    };

  /* =========================
     LOGOUT
  ========================= */

  const logout =
    () => {

      localStorage.removeItem(
        "token"
      );

      setToken(null);
    };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        loading,
        isAuthenticated:
          !!token,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useAuth() {

  return useContext(
    AuthContext
  );
}