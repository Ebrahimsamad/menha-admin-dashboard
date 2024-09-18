import { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginService,
  logout as logoutService,
} from "../services/AuthService";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const promise = loginService(email, password);
      const data = await promise;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);

        toast.success("Logged in successfully!");

        return data.user;
      }
    } catch (error) {
      console.error("Login error: ", error);
      toast.error("Login failed: " + error.message);
    }
  };

  const logout = () => {
    logoutService();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
