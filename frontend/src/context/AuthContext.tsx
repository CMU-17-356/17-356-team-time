// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { API_ENDPOINT } from "../consts";

interface User {
  username: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signup: (userData: SignupData) => Promise<void>;
  signin: (username: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  clearError: () => void;
}

interface SignupData {
  userId: string; // This is used for login in Cognito and as primary key in DynamoDB
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  institution?: string;
  fieldOfInterest?: string;
  bio?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = API_ENDPOINT;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = localStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const signup = async (userData: SignupData) => {
    try {
      setLoading(true);
      setError(null);

      // Call the Cognito signup endpoint
      await axios.post(`${API_URL}/auth/signup`, {
        username: userData.userId, // Map userId to username for Cognito
        password: userData.password,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        institution: userData.institution,
        fieldOfInterest: userData.fieldOfInterest,
        bio: userData.bio,
      });

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  const signin = async (userId: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Call the Cognito signin endpoint
      const response = await axios.post(
        `${API_URL}/auth/signin`,
        {
          username: userId, // Map userId to username for Cognito
          password,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.accessToken) {
        const userData = {
          username: userId,
          accessToken: response.data.accessToken,
        };

        // Save to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        setUser(userData);
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  const signout = async () => {
    try {
      setLoading(true);

      // Call the Cognito signout endpoint
      await axios.post(
        `${API_URL}/auth/signout`,
        {},
        {
          withCredentials: true, // important for cookies/session
        },
      );

      // Clear localStorage
      localStorage.removeItem("userData");
      setUser(null);

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Logout failed");
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        signup,
        signin,
        signout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
