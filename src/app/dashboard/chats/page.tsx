"use client";
import AdminChats from "@/app/dashboard/chats/(role-chats)/AdminChats";
import ParentChats from "@/app/dashboard/chats/(role-chats)/ParentChats";
import StudentChats from "@/app/dashboard/chats/(role-chats)/StudentChats";
import TutorChats from "@/app/dashboard/chats/(role-chats)/TutorChats";
import { useAuth } from "@/app/contexts/authContext";
import { useUser } from "@/app/contexts/userContext";
export default function Chats() {
const { currentUser } = useAuth();
  const user = useUser();

  if(user?.userType === "student")
  {
    return (
      <div>
        <StudentChats />
      </div>
    );
  }

  if(user?.userType === "parent")
  {
    return (
      <div>
        <ParentChats />
      </div>
    );
  }

  if(user?.userType === "tutor")
  {
    return (
      <div>
        <TutorChats />
      </div>
    );
  }

  if(user?.userType === "admin")
  {
    return (
      <div>
        <AdminChats />
      </div>
    );
  }

}