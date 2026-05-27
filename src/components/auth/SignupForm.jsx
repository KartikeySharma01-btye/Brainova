import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "./AuthLayout";

function SignupForm() {

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================
     SIGNUP
  ========================= */

  const handleSignup =
    async (e) => {

      e.preventDefault();

      setError("");

      if (
        !name ||
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
            "https://kartikdgaf-brainova-backend.hf.space/signup",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name,
                email,
                password,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "SIGNUP RESPONSE:",
          data
        );

        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Signup failed"
          );
        }

        navigate("/login");

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
      title="Create account"
      subtitle="
Start using Brainova AI today.
      "
    >

      <form
        onSubmit={
          handleSignup
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

        {/* Name */}
        <div>

          <label className="
            block

            text-sm

            text-[#A89F95]

            mb-2
          ">
            Name
          </label>

          <input
            type="text"

            value={name}

            onChange={(e) =>
              setName(
                e.target.value
              )
            }

            placeholder="
Enter your name
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
Create a password
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
              ? "Creating account..."
              : "Create Account"
          }

        </button>

        {/* Footer */}
        <div className="
          text-center

          text-sm

          text-[#777]
        ">

          Already have an account?{" "}

          <Link
            to="/login"

            className="
              text-[#E8DCCF]

              hover:underline
            "
          >
            Sign in
          </Link>

        </div>

      </form>

    </AuthLayout>
  );
}

export default SignupForm;