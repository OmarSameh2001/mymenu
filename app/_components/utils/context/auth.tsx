"use client";
import { axiosAuth, axiosInstance } from "@/app/_services/axios";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string | null;
  setToken?: React.Dispatch<React.SetStateAction<string | null>>;
  isAdmin?: boolean;
  setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isLoading: true,
  setIsLoading: () => {},
  token: null,
  setToken: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      axiosAuth
        .post("/user/refresh", {}, { withCredentials: true })
        .then((response) => {
          setToken(response.data.accessToken);
          setIsAdmin(response.data.type === "admin");
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error refreshing token:", error);
          setIsLoading(false);
        });
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        token,
        setToken,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
