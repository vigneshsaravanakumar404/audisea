import {LucideIcon} from "lucide-react";

export type UserType = "student" | "parent" | "tutor";

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  path?: string;
}

export interface DashboardLayoutProps{
  userType: UserType;
  profilePicture: string;
  name: string;
}