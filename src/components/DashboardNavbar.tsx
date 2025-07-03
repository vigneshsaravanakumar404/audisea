import { DashboardLayoutProps, SidebarItem } from "../app/types/layout";
import { House, Clock, Calendar, MessageSquare, DollarSign, Settings  } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({userType, profilePicture, name}: DashboardLayoutProps) {
  const sidebarItems: Record<DashboardLayoutProps["userType"], SidebarItem[]> = {
    student: [{ label: "Home", icon: House, path: "/dashboard/student" }, 
      { label: "Book Times", icon: Clock, path: "/dashboard/student/book-times" }, 
      { label: "All Sessions", icon: Calendar, path: "/dashboard/student/all-sessions" }, 
      { label: "Chats", icon: MessageSquare, path: "/dashboard/student/chats" }, 
      { label: "Billing", icon: DollarSign, path: "/dashboard/student/billing" }, 
      { label: "Settings", icon: Settings, path: "/dashboard/student/settings" }],
    
    parent: [{ label: "Home", icon: House, path: "/dashboard/parent" }, 
      { label: "Book Times", icon: Clock, path: "/dashboard/parent/book-times" }, 
      { label: "All Sessions", icon: Calendar, path: "/dashboard/parent/all-sessions" }, 
      { label: "Chats", icon: MessageSquare, path: "/dashboard/parent/chats" }, 
      { label: "Billing", icon: DollarSign, path: "/dashboard/parent/billing" }, 
      { label: "Settings", icon: Settings, path: "/dashboard/parent/settings" }],

    tutor: [{ label: "Home", icon: House, path: "/dashboard/tutor" }, 
      { label: "Availabilities", icon: Clock, path: "/dashboard/tutor/availabilities" }, 
      { label: "All Sessions", icon: Calendar, path: "/dashboard/tutor/all-sessions" }, 
      { label: "Chats", icon: MessageSquare, path: "/dashboard/tutor/chats" }, 
      { label: "Billing", icon: DollarSign, path: "/dashboard/tutor/billing" }, 
      { label: "Settings", icon: Settings, path: "/dashboard/tutor/settings" }],

  };

return (
    <aside className="w-full md:w-[280px] bg-gradient-to-b from-[#494a4a] to-[#3a3b3b] h-screen md:h-full flex flex-col shadow-xl fixed md:relative z-50">
      {/* Profile Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 border-b border-[#5a5a5a]/30">
        <div className="w-20 h-20 bg-gradient-to-br from-[#96aa97] to-[#86998a] rounded-full shadow-lg flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <h2 className="mt-4 font-medium text-[#fbf8f6] text-lg text-center">
          {name || "User"}
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
        </div>
      </div>
    </aside>
  );
};
