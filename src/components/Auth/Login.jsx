"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useSelector } from "react-redux";
import { getAllProviders } from "@features/authSlice";

const Login = () => {
  const providers = useSelector(getAllProviders);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/login`,
          formData
        );
        console.log(response.data.token);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleGithubLogin = () => {
    // Implement GitHub login logic here
    console.log("GitHub login clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 transition-all duration-300 ease-in-out hover:shadow-3xl">
        <Link
          href="/"
          className="text-white hover:text-gray-300 transition-all duration-200 mb-6 inline-block transform hover:scale-125"
        >
          &larr; Home
        </Link>
        <h2 className="text-4xl font-bold text-white text-center mb-2">
          Log In
        </h2>
        <p className="text-sm text-gray-300 text-center mb-8">
          Enter your credentials to access your account.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            {formData.password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
            {errors.password && (
              <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow-md transition-all duration-200 transform hover:scale-105"
          >
            Log In
          </button>
        </form>

        <div className="mt-8">
          <p className="text-sm text-gray-400 text-center mb-4">
            Or log in with
          </p>
          <div className="flex space-x-4">
            {/* Google */}
            <button
              onClick={() => providers && signIn("google")}
              className="flex-1 flex items-center justify-center bg-white text-gray-800 py-2 rounded-lg font-medium shadow-md transition-all duration-200 hover:bg-gray-100 transform hover:scale-105"
            >
              <FaGoogle className="mr-2" />
              Google
            </button>

            {/* Github */}
            <button
              onClick={handleGithubLogin}
              className="flex-1 flex items-center justify-center bg-gray-800 text-white py-2 rounded-lg font-medium shadow-md transition-all duration-200 hover:bg-gray-700 transform hover:scale-105"
            >
              <FaGithub className="mr-2" />
              GitHub
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center mt-8">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors duration-200"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;