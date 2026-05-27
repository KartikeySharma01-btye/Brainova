import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";

function App() {

  const token =
    localStorage.getItem("token");

  return (

    <Routes>

      {/* Home Redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              token
                ? "/chat"
                : "/login"
            }
          />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          token
            ? <Navigate to="/chat" />
            : <LoginPage />
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          token
            ? <Navigate to="/chat" />
            : <SignupPage />
        }
      />

      {/* Chat */}
      <Route
        path="/chat"
        element={
          token
            ? <ChatPage />
            : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}

export default App;