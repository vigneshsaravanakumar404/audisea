"use client";
import React, { useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useAuth } from "../contexts/authContext";
import { useUser } from "../contexts/userContext";
import { useRouter } from "next/navigation";
import { UserType } from "@/app/types/layout";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { userLoggedIn, loading } = useAuth();
  const user = useUser();
  const router = useRouter();

  // Redirect to /signin if not logged in
  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.replace("/signin");
    }
  }, [loading, userLoggedIn, router]);

  console.log("DashboardRootLayout:", user);
  return (
    <div className="flex flex-row h-screen">
      {!user ? (
        <div className="m-auto text-gray-500">Loading user data...</div>
      ) : (
        <>
          <DashboardNavbar
            userType={user.userType as UserType}
            name={user.name || ""}
            profilePicture= {user?.photoURL || "/default-avatar.png"}


          />
          <main className="flex-1 overflow-auto">{children}</main>
        </>
      )}
    </div>
  );
}