"use client";
import React from "react";
import { getUserData, setUserData } from "@/data/firestore/user";
import { useAuth } from "@/app/contexts/authContext";
import { useEffect, useState } from "react";
import { UserInfo } from "@/app/types/user";
import StudentSessions from "./(role-sessions)/StudentSessions";
import ParentSessions from "./(role-sessions)/ParentSessions";

import { useUser } from "@/app/contexts/userContext";



export default function AllSessions() {
  const { currentUser } = useAuth();
  const user = useUser();

  if(user?.userType === "student")
  {
    return (
      <div>
        <StudentSessions />
      </div>
    );
  }

  if(user?.userType === "parent")
  {
    return (
      <div>
        <ParentSessions />
      </div>
    );
  }

}