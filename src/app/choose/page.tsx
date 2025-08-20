"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";
import { User, Users } from "lucide-react"; 
import { getUserData, setUserData } from "@/data/firestore/user";
import { setStudentData } from "@/data/firestore/student";
import { setParentData } from "@/data/firestore/parent";

export default function ChooseRolePage() {
  const { currentUser, userLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"parent" | "student">("parent");

  // Redirect to /signin if not logged in
  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.replace("/signin");
    }
  }, [loading, userLoggedIn, router]);

  // Redirects to respective role dashboard if user is already logged in
  useEffect(() => {
    const userSet = async () => {
      if (currentUser?.uid) {
        const userData = await getUserData(currentUser.uid);
        if(userData) {
          router.replace(`/dashboard`);
        }
      } 
    };
    if (!loading && userLoggedIn) {
      userSet();
    }
  }, [currentUser, loading, userLoggedIn, router]);


  const handleSubmit = async () => {
    if (!currentUser) return;

    // Creates new user document
    const userDoc = {
      uid: currentUser.uid,
      name: currentUser.displayName || "",
      email: currentUser.email || "",
      photoURL: currentUser.photoURL || "",
      userType: selectedRole,
    };

    // Saves user document
    await setUserData(currentUser.uid, userDoc);

    // Creates new student document
    if(selectedRole === "student")
    {
      await setStudentData(currentUser.uid, { uid: currentUser.uid, name: currentUser.displayName || "", email: currentUser.email || "", photoURL: currentUser.photoURL || "", tutors: [], parents: [], classDates: [] });
    }

    // Creates new parent document
    if(selectedRole === "parent")
    {
      await setParentData(currentUser.uid, { uid: currentUser.uid });
    }

    // Redirects to respective role dashboard
    try {
      router.replace(`/dashboard`);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Displays loading screen
  if (loading || !userLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fbf8f6]">
        <div className="text-[#96aa97] text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fbf8f6] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#494a4a] mb-2 text-center">Welcome to Audisea!</h1>
        <p className="text-[#96aa97] text-lg mb-8 text-center">Please select your account type to continue</p>
        <div className="flex flex-col gap-6 w-full">
          <button
            type="button"
            onClick={() => setSelectedRole("parent")}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl border-2 transition-all duration-200 w-full
              ${selectedRole === "parent"
                ? "bg-[#96aa97] border-[#96aa97] text-white shadow-lg"
                : "bg-white border-[#e5e7eb] text-[#494a4a] hover:border-[#96aa97] hover:bg-[#f0f4f0]"}
            `}
          >
            <Users className="w-7 h-7" />
            <span className="text-lg font-semibold">Parent</span>
            {selectedRole === "parent" && (
              <span className="ml-auto text-[#fbf8f6] font-bold">✓</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("student")}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl border-2 transition-all duration-200 w-full
              ${selectedRole === "student"
                ? "bg-[#96aa97] border-[#96aa97] text-white shadow-lg"
                : "bg-white border-[#e5e7eb] text-[#494a4a] hover:border-[#96aa97] hover:bg-[#f0f4f0]"}
            `}
          >
            <User className="w-7 h-7" />
            <span className="text-lg font-semibold">Student</span>
            {selectedRole === "student" && (
              <span className="ml-auto text-[#fbf8f6] font-bold">✓</span>
            )}
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-10 w-full bg-[#96aa97] hover:bg-[#7a8f7b] text-white text-lg font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
}