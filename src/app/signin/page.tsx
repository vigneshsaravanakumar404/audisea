"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import googleIcon from "../../../public/google.png";
import { doSignInWithGoogle } from "@/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

export default function SignInPage() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const onGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const result = await doSignInWithGoogle();
        const user = result.user || auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userType = userSnap.data().userType;
          router.replace(`/dashboard/${userType}`);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fbf8f6] to-[#e6ede7] px-4">
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
