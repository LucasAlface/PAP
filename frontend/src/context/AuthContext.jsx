import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../middleware/request.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await apiRequest(
        "http://localhost:3000/login/me",
        "GET"
      );
      setAuthUser(user);
    } catch {
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (user) => {
    setAuthUser(user);
  };

  const logout = async () => {
    try {
      await apiRequest(
        "http://localhost:3000/auth/logout",
        "POST"
      );
    } catch {}
    
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
