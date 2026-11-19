"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useRestaurant } from "@/context/RestaurantContext";



export default function LoginPage() {
  const router = useRouter();

  const {
    login,
    register,
  } = useRestaurant();

  const [registerMode, setRegisterMode] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submit = async () => {
    setError("");
    setSuccessMessage("");

    if (registerMode) {
      try {
        const success = await register(
          name,
          email,
          password
        );

        setSuccessMessage(success.message);
        setRegisterMode(false);
        setPassword("");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Registration failed."
        );
      }
      return;
    }

    const success = await login(
      email,
      password
    );

    if (!success) {
      setError(
        "Invalid email or password."
      );
      return;
    }
    setSuccessMessage(success.message); // show bar

    if (
      email === "admin@foodies.com"
    ) {
      router.push("/admin");
    } else {
      router.push(success.redirect);
    }
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center flex"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85')",
      }}
    >

      <div className="hidden md:flex w-1/2 bg-black/60 text-white items-center justify-center">

        <div className="max-w-sm">

          <h1 className="text-4xl font-bold">
            🍴 Foodies
          </h1>

          <h2 className="text-3xl font-bold mt-10">
            Good Food
            <br />
            Great Moments
          </h2>

          <p className="text-sm mt-5 text-gray-200">
            Sign in to your account and enjoy
            a seamless ordering experience.
          </p>

        </div>

      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">

        <div className="w-full max-w-md">

          <div className="flex justify-center gap-10 border-b mb-7">

            <button
              onClick={() => {
                setRegisterMode(false);
                setError("");
                setSuccessMessage("");
              }}
              className={`pb-3 text-sm font-bold ${
                !registerMode
                  ? "border-b-2 border-green-700"
                  : ""
              }`}
            >
              Login
            </button>

            <button
              onClick={() => {
                setRegisterMode(true);
                setError("");
                setSuccessMessage("");
              }}
              className={`pb-3 text-sm font-bold ${
                registerMode
                  ? "border-b-2 border-green-700"
                  : ""
              }`}
            >
              Register
            </button>

          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="bg-green-50 text-green-700 p-3 rounded text-sm mb-4"
            >
              {successMessage}
            </div>
          )}

          {registerMode && (
            <input
              className="w-full border rounded p-3 mb-4 text-sm"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}

          <input
            className="w-full border rounded p-3 mb-4 text-sm"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            className="w-full border rounded p-3 mb-2 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {!registerMode && (
            <div className="flex justify-between text-xs mt-3">
              <label>
                <input
                  type="checkbox"
                  className="mr-2"
                />
                Remember me
              </label>

              <span className="text-green-700">
                Forgot password?
              </span>
            </div>
          )}

          <button
            onClick={submit}
            className="btn-green w-full mt-6"
          >
            {registerMode
              ? "Create Account"
              : "Login"}
          </button>

          <div className="text-center text-xs my-4">
            OR
          </div>

          <button className="w-full border rounded p-3 text-sm mb-3">
            🇬 Continue with Google
          </button>

          <button className="w-full border rounded p-3 text-sm">
            🔵 Continue with Facebook
          </button>

          <p className="text-center text-xs mt-5">
            {registerMode
              ? "Already have an account?"
              : "Don't have an account?"}{" "}

            <button
              className="text-green-700 font-bold"
              onClick={() => {
                setRegisterMode(!registerMode);
                setError("");
                setSuccessMessage("");
              }}
            >
              {registerMode
                ? "Login"
                : "Register"}
            </button>
          </p>

          <Link
            href="/"
            className="block text-center text-xs mt-5 text-gray-500"
          >
            ← Back to Foodies
          </Link>

        </div>
      </div>
    </main>
  );
}