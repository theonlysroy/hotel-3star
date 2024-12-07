import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [managerData, setManagerData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  // Simple form validation
  const validateForm = () => {
    if (
      !managerData.name ||
      !managerData.password ||
      !managerData.phoneNumber
    ) {
      setError("Both fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(managerData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManagerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/manager/register",
          managerData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response?.data?.success) {
          alert(response?.data?.message);
          navigate("/login");
        }
      }
    } catch (error) {
      alert(`Login failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={managerData.name}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={managerData.email}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={managerData.password}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 font-medium"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={managerData.phoneNumber}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin phone number"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
