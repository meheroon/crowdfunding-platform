"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axiosSecure from "@/utils/axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axiosSecure.get("/users/me");
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem("access-token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axiosSecure.post("/auth/login", {
      user_email: email,
      password,
    });
    localStorage.setItem("access-token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axiosSecure.post("/auth/register", userData);
    localStorage.setItem("access-token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const googleLogin = async (googleUser) => {
    const res = await axiosSecure.post("/auth/google-login", {
      display_name: googleUser.displayName,
      user_email: googleUser.email,
      photo_url: googleUser.photoURL,
      google_id: googleUser.uid,
    });
    localStorage.setItem("access-token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("access-token");
    setUser(null);
  };

  const updateUser = async () => {
    try {
      const res = await axiosSecure.get("/users/me");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const authInfo = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
