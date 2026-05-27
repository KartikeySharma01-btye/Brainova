import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import AuthLayout from "./AuthLayout";

function LoginForm() {

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================
     LOGIN
  ========================= */

  const handleLogin =
    async (e) => {

      e.preventDefault();

      setError("");

      if (
        !email ||
        !password
      ) {

        setError(
          "Please fill all fields"
        );

        return;
      }

      try {

        setLoading(true);

        const response =
          await fetch(
            "https://kartikdgaf-brainova-backend.hf.space/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
                password,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "LOGIN RESPONSE:",
          data
        );

        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Login failed"
          );
        }

        const token =
          data.access_token ||
          data.token;

        if (!token) {

          throw new Error(
            "Token not received"
          );
        }

        login(token);

        window.location.href = "/chat";

      } catch (err) {

        console.error(err);

        setError(
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="
Sign in to continue using Brainova AI.
      "
    >

      <form
        onSubmit={
          handleLogin
        }

        className="
          space-y-5
        "
      >

        {/* Error */}
        {error && (

          <div className="
            px-4
            py-3

            rounded-xl

            bg-red-500/10

            border
            border-red-500/20

            text-sm
            text-red-400
          ">
            {error}
          </div>

        )}

        {/* Email */}
        <div>

          <label className="
            block

            text-sm

            text-[#A89F95]

            mb-2
          ">
            Email
          </label>

          <input
            type="email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            placeholder="
Enter your email
            "

            className="
              w-full

              px-4
              py-3

              rounded-xl

              bg-[#1F1F1F]

              border
              border-[#2A2A2A]

              text-[#E8DCCF]

              placeholder:text-[#666]

              outline-none

              focus:border-[#E8DCCF]/30
            "
          />

        </div>

        {/* Password */}
        <div>

          <label className="
            block

            text-sm

            text-[#A89F95]

            mb-2
          ">
            Password
          </label>

          <input
            type="password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            placeholder="
Enter your password
            "

            className="
              w-full

              px-4
              py-3

              rounded-xl

              bg-[#1F1F1F]

              border
              border-[#2A2A2A]

              text-[#E8DCCF]

              placeholder:text-[#666]

              outline-none

              focus:border-[#E8DCCF]/30
            "
          />

        </div>

        {/* Submit */}
        <button
          type="submit"

          disabled={loading}

          className={`
            w-full

            py-3

            rounded-xl

            font-medium

            transition-all

            ${
              loading
                ? `
                  bg-[#2A2A2A]
                  text-[#666]
                `
                : `
                  bg-[#E8DCCF]
                  text-[#121212]

                  hover:opacity-90
                `
            }
          `}
        >

          {
            loading
              ? "Signing in..."
              : "Sign In"
          }

        </button>

        {/* Footer */}
        <div className="
          text-center

          text-sm

          text-[#777]
        ">

          Don’t have an account?{" "}

          <Link
            to="/signup"

            className="
              text-[#E8DCCF]

              hover:underline
            "
          >
            Create account
          </Link>

        </div>

      </form>

    </AuthLayout>
  );
}

export default LoginForm;