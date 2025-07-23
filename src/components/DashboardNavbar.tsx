"use client"
import { DashboardLayoutProps, SidebarItem } from "../app/types/layout";
import { House, Clock, Calendar, MessageSquare, DollarSign, Settings  } from "lucide-react";
import Link from "next/link";
import {doSignOut} from "@/firebase/auth";
import { useRouter } from "next/navigation";


export default function DashboardLayout({userType, profilePicture, name}: DashboardLayoutProps) {
  const sidebarItems: Record<DashboardLayoutProps["userType"], SidebarItem[]> = {
    student: [{ label: "Home", icon: House, path: "/dashboard" }, 
      { label: "Book Times", icon: Clock, path: "/dashboard/book-times" }, 
      { label: "All Sessions", icon: Calendar, path: "/dashboard/all-sessions" }, 
      { label: "Chats", icon: MessageSquare, path: "/dashboard/chats" }, 
      { label: "Billing", icon: DollarSign, path: "/dashboard/billing" }, 
      { label: "Settings", icon: Settings, path: "/dashboard/settings" }],
    
    parent: [{ label: "Home", icon: House, path: "/dashboard" }, 
      { label: "Book Times", icon: Clock, path: "/dashboard/book-times" }, 
      { label: "All Sessions", icon: Calendar, path: "/dashboard/all-sessions" }, 
      { label: "Chats", icon: MessageSquare, path: "/dashboard/chats" }, 
      { label: "Billing", icon: DollarSign, path: "/dashboard/billing" }, 
      { label: "Settings", icon: Settings, path: "/dashboard/settings" }],

    tutor: [{ label: "Home", icon: House, path: "/dashboard" }, 
      { label: "Availabilities", icon: Clock, path: "/dashboard/availabilities" }, 
      { label: "All Sessions", icon: Calendar, path: "/dashboard/all-sessions" }, 
      { label: "Chats", icon: MessageSquare, path: "/dashboard/chats" }, 
      { label: "Billing", icon: DollarSign, path: "/dashboard/billing" }, 
      { label: "Settings", icon: Settings, path: "/dashboard/settings" }],

  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await doSignOut();
      router.replace("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  console.log("Profile picture URL:", profilePicture);


return (
    <aside className="w-full md:w-[280px] bg-gradient-to-b from-[#494a4a] to-[#3a3b3b] h-screen md:h-full flex flex-col shadow-xl fixed md:relative z-50">
      {/* Profile Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 border-b border-[#5a5a5a]/30">
        <img src={profilePicture.trim()} alt="Profile" className = "w-20 h-20 rounded-full"/>
        <h2 className="mt-4 font-medium text-[#fbf8f6] text-lg text-center">
          {name}
        </h2>
        <p className="text-[#96aa97] text-sm font-medium capitalize mt-1">
          {userType}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
        {sidebarItems[userType]?.map((item, index) => (
          <Link
            href={item.path ?? "/"}
            key={`menu-item-${index}`}
            className="flex items-center px-4 py-3 rounded-lg cursor-pointer hover:bg-[#5a5a5a]/50 hover:shadow-md transition-all duration-200 group"
          >
            <item.icon className="w-5 h-5 text-[#96aa97] group-hover:text-[#fbf8f6] transition-colors duration-200" />
            <span className="ml-3 font-medium text-[#fbf8f6] text-sm group-hover:text-white transition-colors duration-200">
              {item.label}
            </span>
          </Link>
        )) || null}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#5a5a5a]/30">
        <div className="text-center">
          <p className="text-[#96aa97] text-xs font-medium">Audisea</p>
          <p className="text-[#7a7b7b] text-xs mt-1">Private Tutoring</p>
          <button className="text-[#96aa97] text-xs font-medium mt-2 hover:text-[#fbf8f6] transition-colors duration-200" onClick ={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
