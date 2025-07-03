import React from "react";
import {Plus, Clock, User} from "lucide-react";

export default function StudentHomePage() {
  return (
    <div className="bg-[#fbf8f6] flex justify-center w-full">
      <div className="bg-[#fbf8f6] w-full max-w-[1512px]">

        {/* Welcome Header */}
        <header className="w-full h-36 bg-[#6e7d6f] px-[74px] flex items-center">
          <h1 className="font-bold text-[#fbf8f6] text-4xl tracking-tight">
            Welcome back, Bob Jr!
          </h1>
        </header>

        {/* Main Content */}
        <main className="px-[74px] py-16 space-y-20">

          {/* Upcoming Sessions */}
          <section aria-labelledby="upcoming-sessions">
            <div className="flex justify-between items-center mb-6">
              <h2 id="upcoming-sessions" className="font-semibold text-[#2f2f2f] text-3xl">
                Upcoming Sessions
              </h2>
              <button className="text-sm font-medium text-[#494a4a] underline hover:text-[#2f2f2f] transition">
                View All
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-5 flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-500"></Plus>
              </div>
              <h3 className="text-gray-700 font-medium text-lg mb-1">No Upcoming Sessions</h3>
              <p className="text-gray-500 text-sm">You haven’t scheduled any sessions for this week.</p>
            </div>
          </section>

          {/* Past Sessions */}
          <section aria-labelledby="past-sessions">
            <div className="flex justify-between items-center mb-6">
              <h2 id="past-sessions" className="font-semibold text-[#2f2f2f] text-3xl">
                Session History
              </h2>
              <button className="text-sm font-medium text-[#494a4a] underline hover:text-[#2f2f2f] transition">
                View All
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-5 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-500"></Clock>
              </div>
              <h3 className="text-gray-700 font-medium text-lg mb-1">No Completed Sessions</h3>
              <p className="text-gray-500 text-sm">Once completed, your past sessions will appear here.</p>
            </div>
          </section>

          {/* Tutors & Subjects */}
          <section aria-labelledby="tutors-subjects">
            <h2 id="tutors-subjects" className="font-semibold text-[#2f2f2f] text-3xl mb-6">
              Assigned Tutors & Subjects
            </h2>
            <div className="bg-gray-100 rounded-xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-5 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-500"></User>
              </div>
              <h3 className="text-gray-700 font-medium text-lg mb-1">No Tutors Assigned</h3>
              <p className="text-gray-500 text-sm">Your assigned tutors will appear here once allocated.</p>
            </div>
          </section>

          {/* Request New Button */}
          <div className="flex justify-center">
            <button className="bg-[#96aa97] hover:bg-[#86998a] text-white text-lg font-semibold px-8 py-4 rounded-md shadow transition-colors">
              Request New Tutor
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
