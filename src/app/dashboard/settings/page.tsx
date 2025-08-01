"use client"

import AdminSettings from "./(role-settings)/AdminSettings";
import ParentSettings from "./(role-settings)/ParentSettings";
import StudentSettings from "./(role-settings)/StudentSettings";
import TutorSettings from "./(role-settings)/TutorSettings";
import { useAuth } from "@/app/contexts/authContext";
import { useUser } from "@/app/contexts/userContext";

export default function Settings() {
  const { currentUser } = useAuth();
  const user = useUser();

  if(user?.userType === "student")
  {
    return (
      <div>
        <StudentSettings />
      </div>
    );
  }

  if(user?.userType === "parent")
  {
    return (
      <div>
        <ParentSettings />
      </div>
    );
  }

  if(user?.userType === "tutor")
  {
    return (
      <div>
        <TutorSettings />
      </div>
    );
  }

  if(user?.userType === "admin")
  {
    return (
      <div>
        <AdminSettings />
      </div>
    );
  }
}