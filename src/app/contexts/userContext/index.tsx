"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/authContext";
import { getUserData } from "@/data/firestore/user";
import { UserInfo } from "@/app/types/user";

const UserContext = createContext<UserInfo | null>(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        const data = await getUserData(currentUser.uid);
        setUser(data as UserInfo);
      } else {
        setUser(null);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};