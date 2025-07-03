"use client"
import React from "react";
import googleIcon from "../../../public/google.png";

export default function SignUpPage() {
  return (
    <div className="bg-[#fbf8f6] flex justify-center items-center w-full min-h-screen font-josefin pt-20" style={{ minHeight: '100dvh' }}>
      <div className="w-full max-w-[445px] bg-transparent border-none shadow-none overflow-y-auto max-h-[calc(100dvh-5rem)] p-4">
        <div className="p-0">
          <div className="text-left space-y-2 mb-8">
            <h1 className="text-[#96aa97] text-5xl font-bold">Sign Up</h1>
            <div className="h-1 w-[168px] bg-[#96aa97]" />
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="font-bold text-[#494a4a]"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                className="h-10 bg-[#fbf8f6] p-[10px] text-[#494A4A] rounded-xl border border-[#96aa97] focus:ring-2 focus:ring-[#96aa97] focus:border-transparent w-full"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="font-bold text-[#494a4a]"
              >
                Password:
              </label>
              <input
                id="password"
                type="password"
                className="h-10 bg-[#fbf8f6] p-[10px] text-[#494A4A] rounded-xl border border-[#96aa97] focus:ring-2 focus:ring-[#96aa97] focus:border-transparent w-full"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="font-bold text-[#494a4a]"
              >
                Confirm Password:
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="h-10 bg-[#fbf8f6] p-[10px] text-[#494A4A] rounded-xl border border-[#96aa97] focus:ring-2 focus:ring-[#96aa97] focus:border-transparent w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-[#494a4a] mb-[5px]">
                Are you a parent or a student?
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="parent" name="role" value="parent" defaultChecked />
                  <label
                    htmlFor="parent"
                    className="font-normal text-[#494a4a]"
                  >
                    Parent
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="student" name="role" value="student" />
                  <label
                    htmlFor="student"
                    className="font-normal text-[#494a4a]"
                  >
                    Student
                  </label>
                </div>
              </div>
            </div>

            <button className="w-full h-11 bg-[#96aa97] rounded-xl hover:bg-[#86998a] transition-colors mt-2">
              <span className="font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] text-white text-[length:var(--body-medium-medium-font-size)] text-center tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)]">
                Sign Up
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center space-x-4 my-8">
            <hr className="flex-1 bg-[#494a4a] h-0.5 border-0" />
            <span className="text-[#494a4a] text-base font-bold">Or continue with</span>
            <hr className="flex-1 bg-[#494a4a] h-0.5 border-0" />
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center mb-2">
            <button className="w-14 h-14 flex items-center justify-center hover:opacity-80 transition-opacity">
              <img
                src={googleIcon.src}
                alt="Google Sign In"
                className="w-10 h-10 object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}