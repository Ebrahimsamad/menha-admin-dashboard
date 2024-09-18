const BASE_URL = "https://menha-backend.vercel.app";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Failed to log in" };
    }

    if (data.user && data.user.isAdmin) {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    }

    return { error: "Access denied: You are not an admin" };
  } catch (error) {
    console.error("Error during login:", error);
    return { error: error.message };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
