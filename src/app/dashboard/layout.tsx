import React from "react";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const userType = "student";
  const name = "Esha";
  const profilePicture = "/path/to/picture.jpg";

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
