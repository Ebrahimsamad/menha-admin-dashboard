import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Spinner from "../../ui/Spinner";

const AdminEdit = ({ admin, onClose, onUpdate }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  useEffect(() => {
    if (admin) {
      setUserName(admin.userName || "");
      setEmail(admin.email || "");
      setPassword("");
      setConfirmPassword("");
    } else {
      setUserName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [admin]);
  
  useEffect(() => {
    validateForm();
  }, [userName, email, password, confirmPassword]);
  const resetForm = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };
  
  const validateForm = () => {
    let newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = "";
  } else if (userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters long";
  } else if (!/^[a-zA-Z]/.test(userName)) {
      newErrors.userName = "Username must start with a letter";
  }
  

    const isValidEmail = /^\S+@gmail\.com$/.test(email);
    if (!email.trim()) {
      newErrors.email = "";
    } else if (!isValidEmail) {
      newErrors.email = "Email is invalid, example@gmail.com";
    }

    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    if (!admin) {
      if (!password) {
        newErrors.password = "";
      } else if (!isValidPassword) {
        newErrors.password = "Password must be at least 8 characters long and contain at least one letter and one number";
      }

      if (password !== confirmPassword) { 
        newErrors.confirmPassword = "Passwords do not match";
      } 
    } else {
      if (password && !isValidPassword) {
        newErrors.password = "Password must be at least 8 characters long and contain at least one letter and one number";
      }

      if (password && password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    try {
      resetForm();
      const newAdmin = await adminService.createAdmin(formData);
      toast.success("Admin created successfully");

      onClose();
      onUpdate(newAdmin);
    } catch (error) {
      
      const errorMessage = error.message.includes("Email is already in use")
        ? "This email is already in use."
        : "An error occurred while creating the account.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (confirmPassword) formData.append("confirmPassword", confirmPassword);

    try {
      const updatedAdmin = await adminService.updateAdmin(admin._id, formData);
      toast.success("Admin updated successfully");

      onClose();
      onUpdate(updatedAdmin);
    } catch (error) {
      
      const errorMessage = error.message.includes("Email is already in use")
        ? "This email is already in use."
        : "An error occurred while updating the account.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (admin) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };   

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
          {admin ? "Edit Admin" : "Create New Admin"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="userName"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-2 rounded-md p-3 transition-all duration-200 ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
              {userName && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {errors.userName ? (
                    <FaTimesCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <FaCheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.userName && <p className="mt-2 text-sm text-red-600">{errors.userName}</p>}
          </div>
    
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-2 rounded-md p-3 transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email"
              />
              {email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {errors.email ? (
                    <FaTimesCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <FaCheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>
    
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-2 rounded-md p-3 transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>
    
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-2 rounded-md p-3 transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>
    
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
               <span className="flex items-center">
               <Spinner color="white" />
               Processing...
             </span>
             
              ) : (
                admin ? "Update Admin" : "Create Admin"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEdit;