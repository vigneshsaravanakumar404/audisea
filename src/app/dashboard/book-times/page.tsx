"use client";
import React from "react";
import { getUserData, setUserData } from "@/data/firestore/user";
import { useAuth } from "@/app/contexts/authContext";
import { useEffect, useState } from "react";
import { UserInfo } from "@/app/types/user";
import StudentBookTimes from "./(role-book)/StudentBookTimes";
import ParentBookTimes from "./(role-book)/ParentBookTimes";
import { useUser } from "@/app/contexts/userContext";



export default function BookTimes() {
  const { currentUser } = useAuth();
  const user = useUser();

  if(user?.userType === "student")
  {
    return (
      <div>
        <StudentBookTimes />
      </div>
    );
  }

  if(user?.userType === "parent")
  {
    return (
      <div>
        <ParentBookTimes />
      </div>
    );
  }

}