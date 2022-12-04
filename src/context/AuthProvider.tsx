import axios from "axios";
import React, { FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_LOGIN = "https://api.noroff.dev/api/v1/social/auth/login";

type LoginDataTypes = {
  email: string;
  password: string;
};

type AuthProvider = {
  children: React.ReactNode;
};

type AuthContextType = {
  token: string;
  onLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onLogout: () => void;
  userData: any;
  error: any;
  loading: boolean;
};

//create AuthContext

export const AuthContext = React.createContext<AuthContextType>(null!);

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProvider) => {
  const [token, setToken] = React.useState<string>(null!);
  const [userData, setUserData] = React.useState<any>(null!);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string[]>(null!);

  useEffect(() => {
    const userDataStorage = localStorage.getItem("userData");
    console.log({ token, userDataStorage });
    if (!token && userDataStorage) {
      const parsedUsrData = JSON.parse(userDataStorage);
      setUserData(parsedUsrData);
      setToken(parsedUsrData?.accessToken);
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as LoginDataTypes;

    try {
      setLoading(true);
      const response = await axios.post(API_LOGIN, data);
      const responseData = response.data;

      localStorage.setItem("userData", JSON.stringify(responseData));
      setUserData(responseData);
      setToken(responseData.accessToken);
    } catch (error: any) {
      setError(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setToken("");
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    userData,
    error,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
