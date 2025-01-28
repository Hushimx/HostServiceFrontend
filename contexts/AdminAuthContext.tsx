"use Dashboard";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import ErrorComponent from "@/components/ui/error";
import { Role,  } from '../lib/rbac';
import { toast } from "sonner";

type User = {
  name?: string;
  email: string;
  role: Role;
  countryId: string;
};

type DashboardAuthContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  role: Role;
};

const DashboardAuthContext = createContext<DashboardAuthContextType | undefined>(undefined);

export const useDashboardAuth = () => {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error("useDashboardAuth must be used within a DashboardAuthProvider");
  }
  return context;
};

export const DashboardAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/admin/auth/profile", {
          withCredentials: true, // Include cookies in the request
        });

        setUser(response.data); // Assume the response contains user data
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized access. Please log in.");
        } else {
          setError("An error occurred while fetching user data.");
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.href = "/admin/signin"; // Forces full page reload
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
        <Loading message="Logging in..." />
    );
  }

  if (error) {
    return (
        <ErrorComponent message="Error"   />
    );
  }

  return (
    <DashboardAuthContext.Provider value={{ user, setUser,role: user?.role }}>
      {user ? children : null}
    </DashboardAuthContext.Provider>
  );
};
