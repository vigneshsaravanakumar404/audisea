"use client"
import AdminBilling from "./(role-billing)/AdminBilling";
import TutorBilling from "./(role-billing)/TutorBilling";
import ParentBilling from "./(role-billing)/ParentBilling";
import StudentBilling from "./(role-billing)/StudentBilling";
import { useAuth } from "@/app/contexts/authContext";
import { useUser } from "@/app/contexts/userContext";



export default function Billing() {
  const user = useUser();

  if(user?.userType === "student")
  {
    return (
      <div>
        <StudentBilling />
      </div>
    );
  }

  if(user?.userType === "parent")
  {
    return (
      <div>
        <ParentBilling />
      </div>
    );
  }

  if(user?.userType === "tutor")
  {
    return (
      <div>
        <TutorBilling />
      </div>
    );
  }

  if(user?.userType === "admin")
  {
    return (
      <div>
        <AdminBilling />
      </div>
    );
  }

}