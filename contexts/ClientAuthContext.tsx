"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { useLanguage } from "./LanguageContext";

type User = {
  name?: string;
  hotelName: string;
  roomNumber: string;
  countryCode: string;
  currencySign: string;
  token: string;
};

type ClientAuthContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
};

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
};

export const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [error, setError] = useState<boolean>(false);
  const { t } = useLanguage()
  const router = useRouter();
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
      if (!token) {
        router.push("/"); // Redirect to login if token is not found
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser({...response.data, token: token});
      } catch (error: any) {
        console.error(error);
        if (error.response?.status === 401) {
          setError(true);
        }
        router.push("/"); // Redirect to login on unauthorized
      } finally {
        setLoading(false); // Ensure loading is set to false after the request
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <Loading message={t("loading")} />
    );
  }

  if (error) {
    return null; // Prevent further rendering if redirecting
  }

  return (
    <ClientAuthContext.Provider value={{ user, setUser }}>
      {user ? children : null} {/* Render children only after user is fetched */}
    </ClientAuthContext.Provider>
  );
};
