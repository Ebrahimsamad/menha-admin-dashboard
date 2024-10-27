import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../ui/Spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();

  const email = watch("email");
  const password = watch("password");
  const navigate = useNavigate();

  useEffect(() => {
    const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
      password
    );
    setIsButtonDisabled(!(isValidEmail && isValidPassword));
  }, [email, password]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);

      if (!result) {
        console.error("Login failed, result was undefined or invalid.");
        return;
      }

      if (result.isAdmin) {
        navigate("/admin");
      } else {
        console.error("You are not authorized. Only admins can log in.");
        return;
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^\S+@\S+/.test(email);
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
    password
  );

  return (
    <div className="h-[100vh] bg-[url('/2.jpg')] bg-cover from-[#003a65] to-[#b92a3b] flex items-center justify-center">
      <div className="relative z-10 p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#003a65] text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              className="h-12 w-full px-4 text-[#003a65] border-b-2 border-[#003a65] focus:border-[#b92a3b] focus:outline-none transition duration-300"
              placeholder="Email"
            />
            <div className="flex justify-left mt-1">
              {isValidEmail ? (
                <p className="text-green-600 flex items-center text-center">
                  <FaCheckCircle className="mr-1" /> Valid Email
                </p>
              ) : (
                email && (
                  <p className="text-red-600 flex items-center text-center">
                    <FaTimesCircle className="mr-1" /> Invalid Email
                  </p>
                )
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="h-12 w-full px-4 text-[#003a65] border-b-2 border-[#003a65] focus:border-[#b92a3b] focus:outline-none transition duration-300"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#003a65]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-left mt-1">
              {isValidPassword ? (
                <p className="text-green-600 flex items-center text-left">
                  <FaCheckCircle className="mr-1" /> Valid Password
                </p>
              ) : (
                password && (
                  <p className="text-red-600 flex items-center text-left">
                    <FaTimesCircle className="mr-3 w-6 h-6" /> Password must
                    contain at least 8 characters, one letter, and one number.
                  </p>
                )
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isButtonDisabled || loading}
            className={`w-full py-3 rounded-lg transition duration-300 bg-[#b92a3b] hover:bg-[#a02234] text-white flex justify-center items-center ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                : ""
            }`}
          >
            {loading ? <Spinner /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
