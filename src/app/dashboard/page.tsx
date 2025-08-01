"use client";
import React from "react";
import { getUserData, setUserData } from "@/data/firestore/user";
import { useAuth } from "@/app/contexts/authContext";
import { useEffect, useState } from "react";
import { UserInfo } from "@/app/types/user";
import StudentDashboard from "./(homes)/StudentDashboard";
import ParentDashboard from "./(homes)/ParentDashboard";
import AdminDashboard from "./(homes)/AdminDashboard";
import TutorDashboard from "./(homes)/TutorDashboard";
import { useUser } from "../contexts/userContext";



export default function DashboardPage() {
  const user = useUser();


  if(user?.userType === "student")
  {
    return (
      <div>
        <StudentDashboard />
      </div>
    );
  }

  if(user?.userType === "parent")
  {
    return (
      <div>
        <ParentDashboard />
      </div>
    );
  }

  if(user?.userType === "tutor")
  {
    return (
      <div>
        <TutorDashboard />
      </div>
    );
  }

  if(user?.userType === "admin")
  {
    return (
      <div>
        <AdminDashboard />
      </div>
    );
  }
}