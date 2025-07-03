"use client";
import React, { useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { currentUser,userLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.replace("/signin");
    }
  }, [loading, userLoggedIn, router]);

  if (loading || !userLoggedIn) {
    return <div>Loading...</div>;
  }

  const userType = "student";
  const name = currentUser?.displayName ?? "User";
  const profilePicture = currentUser?.photoURL ?? "";

  return (
    <div className="flex flex-row h-screen">
      <DashboardNavbar
        userType={userType}
        name={name}
        profilePicture={profilePicture}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}