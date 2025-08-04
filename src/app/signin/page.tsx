"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import googleIcon from "../../../public/google.png";
import { doSignInWithGoogle } from "@/firebase/auth";
import { useAuth } from "../contexts/authContext";
import { getUserData } from "@/data/firestore/user";

export default function SignInPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  // Redirects to respective role dashboard if user is already logged in
  useEffect(() => {
    const userSet = async () => {
      if (currentUser?.uid) {
        const user = await getUserData(currentUser.uid);
        if (user) {
          router.replace(`/dashboard`);
        }
      }
    };
    userSet();
  }, []);


  // Google sign-in function. If user is already logged in, redirects to respective role dashboard. If it's a new user, redirects to choose role page
  const onGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const result = await doSignInWithGoogle();
        const user = await getUserData(result.user.uid);
        if (user) {
          router.replace(`/dashboard`);
        } else {
          router.replace("/choose");
        }
      } catch (err: any) {
        setError(err.message || "Google sign-in failed");
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-[#e5e7eb] flex flex-col items-center space-y-6">
        {/* Title */}
        <h2 className="text-[#96aa97] text-2xl font-semibold font-['Josefin_Sans'] text-center">
          Sign in to your account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center w-full text-sm">
            {error}
          </div>
        )}

        {/* Google Sign-In */}
        <form className="w-full" onSubmit={onGoogleSubmit}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-4 border-2 border-[#96aa97] bg-white hover:bg-[#96aa97] text-[#96aa97] hover:text-white font-bold text-lg px-6 py-3 rounded-xl transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#96aa97] focus:ring-offset-2"
            disabled={isSigningIn}
            aria-label="Sign in with Google"
          >
            <img
              src={googleIcon.src}
              alt="Google Sign In"
              className="w-7 h-7 object-contain"
            />
            {isSigningIn ? "Signing In..." : "Sign in with Google"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-[#b0b0b0] text-center w-full pt-4">
          &copy; {new Date().getFullYear()} Audisea. All rights reserved.
        </p>
      </div>
    </div>
  );
}
