"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import googleIcon from "../../../public/google.png";
import { doSignInWithGoogle, doSignInWithEmailAndPassword } from "@/firebase/auth";
import { useAuth } from "../contexts/authContext";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

export default function SignInPage() {
  const { userLoggedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");



  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        // router.replace("/choose"); // No need, useEffect will handle
      } catch (err: any) {
        setError(err.message || "Sign in failed");
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const result = await doSignInWithGoogle();
        const user = result.user || auth.currentUser; // get user from result or auth

        // Check if user doc exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Redirect to dashboard with userType
          const userType = userSnap.data().userType;
          router.replace(`/dashboard/${userType}`);
        } else {
          // Redirect to choose page
          router.replace("/choose");
        }
      } catch (err: any) {
        setError(err.message || "Google sign in failed");
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="bg-[#fbf8f6] flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-[445px] space-y-8">
        {/* Title */}
        <div className="text-left space-y-2">
          <h1 className="text-[#96aa97] text-5xl font-bold font-helvetica">Sign In</h1>
          <div className="h-1 w-[168px] bg-[#96aa97]" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-[#494a4a] font-bold text-base">
              Email:
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 bg-[#fbf8f6] p-[10px] text-[#494A4A] rounded-xl border border-[#96aa97] focus:ring-2 focus:ring-[#96aa97] focus:border-transparent w-full"
              required
              disabled={isSigningIn}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-[#494a4a] font-bold text-base">
              Password:
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 bg-[#fbf8f6] p-[10px] text-[#494A4A] rounded-xl border border-[#96aa97] focus:ring-2 focus:ring-[#96aa97] focus:border-transparent w-full"
              required
              disabled={isSigningIn}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-[#96aa97] font-bold text-base hover:underline font-josefin"
              // onClick={...} // Add forgot password logic if needed
              tabIndex={-1}
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full h-11 bg-[#96aa97] hover:bg-[#7a8f7b] rounded-xl text-white font-medium text-base"
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center space-x-4">
          <hr className="flex-1 bg-[#494a4a] h-0.5 border-0" />
          <span className="text-[#494a4a] text-base font-bold">Or continue with</span>
          <hr className="flex-1 bg-[#494a4a] h-0.5 border-0" />
        </div>

        {/* Google Sign-In */}
        <div className="flex justify-center">
          <button
            onClick={onGoogleSubmit}
            className="w-14 h-14 flex items-center justify-center hover:opacity-80 transition-opacity"
            disabled={isSigningIn}
            aria-label="Sign in with Google"
          >
            <img
              src={googleIcon.src}
              alt="Google Sign In"
              className="w-10 h-10 object-contain"
            />
          </button>
        </div>
      </div>
    </div>
  );
}