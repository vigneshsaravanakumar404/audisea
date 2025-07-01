import React from "react";
import googleIcon from "../../../public/google.png";
export default function SignInPage() {
  return (
    <div className="bg-[#fbf8f6] flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-[445px] space-y-8">
        {/* Title */}
        <div className="text-left space-y-2">
          <h1 className="text-[#96aa97] text-5xl font-bold font-helvetica">Sign In</h1>
          <div className="h-1 w-[168px] bg-[#96aa97]" />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-[#494a4a] font-bold text-base">
            Email:
          </label>
          <input
            id="email"
            type="email"
            className="h-10 bg-[#fbf8f6] rounded-xl border border-[#96aa97] focus:ring-2 focus:ring-[#96aa97] focus:border-transparent w-full"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-[#494a4a] font-bold text-base">
            Password:
          </label>
          <input
            id="password"
            type="password"
            className="h-10 bg-[#fbf8f6] rounded-xl border border-[#96aa97] focus:ring-2 focus:ring-[#96aa97] focus:border-transparent w-full"
          />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button className="text-[#96aa97] font-bold text-base hover:underline font-josefin">
            Forgot Password?
          </button>
        </div>

        {/* Sign In Button */}
        <button className="w-full h-11 bg-[#96aa97] hover:bg-[#7a8f7b] rounded-xl text-white font-medium text-base">
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center space-x-4">
          <hr className="flex-1 bg-[#494a4a] h-0.5 border-0" />
          <span className="text-[#494a4a] text-base font-bold">Or continue with</span>
          <hr className="flex-1 bg-[#494a4a] h-0.5 border-0" />
        </div>

        {/* Google Sign-In */}
        <div className="flex justify-center">
          <button className="w-14 h-14 flex items-center justify-center hover:opacity-80 transition-opacity">
            <img
              src={googleIcon.src} // Replace with actual image path
              alt="Google Sign In"
              className="w-10 h-10 object-contain"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
