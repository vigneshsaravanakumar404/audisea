"use client";
import React, { useEffect, useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/app/types/user";
import { getUserData } from "@/data/firestore/user";
import { UserType } from "@/app/types/layout";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, userLoggedIn, loading } = useAuth();
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();

  // Redirect to /signin if not logged in
  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.replace("/signin");
    }
  }, [loading, userLoggedIn, router]);

  // Sets user - MOVED BEFORE CONDITIONAL RETURN
  useEffect(() => {
    const userSet = async () => {
      if (currentUser?.uid) {
        const userData = await getUserData(currentUser.uid);
        setUser(userData as UserInfo | null);
      } else {
        setUser(null);
      }
    };
    userSet();
  }, [currentUser]);


  return (
    <div className="flex flex-row h-screen">
      {!user ? (
        <div className="m-auto text-gray-500">Loading user data...</div>
      ) : (
        <>
          <DashboardNavbar
            userType={user.userType as UserType}
            name={user.name || ""}
            profilePicture={user.photoURL || ""}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </>
      )}
    </div>
  );

}