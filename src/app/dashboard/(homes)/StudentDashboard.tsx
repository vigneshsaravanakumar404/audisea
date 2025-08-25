"use client";
import React from "react";
import {Plus, Clock, User} from "lucide-react";
import { useEffect, useState } from "react";
import { UserInfo } from "@/app/types/user";
import { useUser } from "@/app/contexts/userContext";
import { getStudentUpcomingDates, getStudentPastDates,getStudentTutors } from "@/data/firestore/student";
import { filterSessionsByDate } from "@/data/firestore/session";
import { Session } from "@/app/types/session";
import dayjs from "dayjs";


export default function DashboardPage() {

  const user = useUser();

  const [upcomingDates, setUpcomingDates] = useState<string[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);

  const [pastDates, setPastDates] = useState<string[]>([]);
  const [pastSessions, setPastSessions] = useState<Session[]>([]);

  const [tutors, setTutors] = useState<UserInfo[]>([]);

  useEffect(() => {
    async function findUpcoming() {
      if (user) {
        const upcomingDates = await getStudentUpcomingDates(user.uid);     
        setUpcomingDates(upcomingDates as string[]);   

        const pastDates = await getStudentPastDates(user.uid);     
        setPastDates(pastDates as string[]);

        const tutors = await getStudentTutors(user.uid);     
        setTutors(tutors);
        
      }
    }

    findUpcoming();
  }, [user]);

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      const sortedDates = [...upcomingDates].sort(
        (a, b) => dayjs(a).valueOf() - dayjs(b).valueOf()
      );

      if (sortedDates.length > 0) {
        const topThree = sortedDates.slice(0, 3);

        const sessionsList = await Promise.all(
          topThree.map(date => filterSessionsByDate(date))
        );

        const allSessions = sessionsList.flat() as Session[];

        setUpcomingSessions(allSessions);
      }
    };

    if (upcomingDates.length > 0) {
      fetchUpcomingSessions();
    }
  }, [upcomingDates]);

  useEffect(() => {
    const fetchPastSessions = async () => {
      const sortedDates = [...pastDates].sort(
        (a, b) => dayjs(b).valueOf() - dayjs(a).valueOf()
      );

      if (sortedDates.length > 0) {
        const topThree = sortedDates.slice(0, 3);

        const sessionsList = await Promise.all(
          topThree.map(date => filterSessionsByDate(date))
        );

        const allSessions = sessionsList.flat() as Session[];

        setPastSessions(allSessions);
      }
    };

    if (pastDates.length > 0) {
      fetchPastSessions();
    }
  }, [pastDates]);




  return (
    
    <div className="bg-[#fbf8f6] flex justify-center w-full">
      <div className="bg-[#fbf8f6] w-full max-w-[1512px]">

        {/* Welcome Header */}
        <header className="w-full h-36 bg-[#6e7d6f] px-[74px] flex items-center">
          <h1 className="font-bold text-[#fbf8f6] text-4xl tracking-tight">
            Hi, {user?.name}!
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

            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.uid}
                    className="group bg-white rounded-2xl border-2 border-[#96aa97]/20 hover:border-[#96aa97] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        {/* Left side - Subject, Tutor, and Details */}
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#96aa97] to-[#86998a] rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-xl font-bold text-[#2f2f2f]">
                                {session.subject}
                              </h3>
                              <p className="text-gray-600">with {session.tutor}</p>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-[#96aa97]" />
                                <span className="font-medium">{session.startTime} - {session.endTime}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-[#96aa97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{dayjs(session.date).format('dddd, MMMM D, YYYY')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right side - Date Badge and Meeting Link */}
                        <div className="flex items-center space-x-4">
                          <div className="bg-[#96aa97] text-white text-sm font-semibold px-4 py-2 rounded-full">
                            {dayjs(session.date).format('MMM D')}
                          </div>
                          
                          {session.meetURL ? (
                            <a
                              href={session.meetURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#96aa97] to-[#86998a] hover:from-[#86998a] hover:to-[#96aa97] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Join Meeting</span>
                            </a>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-500 text-sm bg-gray-100 px-4 py-3 rounded-xl">
                              <Clock className="w-4 h-4" />
                              <span>Link Pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm">
                  <Plus className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-gray-700 font-semibold text-xl mb-2">
                  No Upcoming Sessions
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  You haven't scheduled any sessions for this week.
                </p>
                <button className="bg-[#96aa97] hover:bg-[#86998a] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
                  Book Your First Session
                </button>
              </div>
            )}
          </section>

          {/* Past Sessions */}
          <section aria-labelledby="past-sessions" className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 id="past-sessions" className="font-semibold text-[#2f2f2f] text-3xl">
                Past Sessions
              </h2>
              <button className="text-sm font-medium text-[#494a4a] underline hover:text-[#2f2f2f] transition">
                View All
              </button>
            </div>

            {pastSessions.length > 0 ? (
              <div className="space-y-4">
                {pastSessions.map((session) => (
                  <div
                    key={session.uid}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-between px-6 py-4"
                  >
                    {/* Left: Subject + Tutor */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-[#2f2f2f] flex items-center justify-center text-white font-semibold">
                        {session.tutor?.[0] || "?"}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {session.subject}
                        </h3>
                        <p className="text-sm text-gray-600">{session.tutor}</p>
                      </div>
                    </div>

                    {/* Middle: Date + Time */}
                    <div className="text-gray-700 text-sm">
                      {dayjs(session.date).format('MMM D')}{" "}
                      · {session.startTime} - {session.endTime}
                    </div>

                    {/* Right: Past session action */}
                    <div>
                      {session.description ? (
                        <a
                          href={session.description}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-4 py-2 rounded-md transition"
                        >
                          View Summary
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          No summary available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-5 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-gray-700 font-medium text-lg mb-1">
                  No Past Sessions
                </h3>
                <p className="text-gray-500 text-sm">
                  You haven’t completed any sessions yet.
                </p>
              </div>
            )}
          </section>


          {/* Tutors & Subjects */}
          <section aria-labelledby="tutors-subjects">
            <h2
              id="tutors-subjects"
              className="font-semibold text-[#2f2f2f] text-3xl mb-6"
            >
              Assigned Tutors & Subjects
            </h2>

            {tutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map((tutor) => (
                  <div
                    key={tutor.uid}
                    className="bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col"
                  >
                    {/* Tutor avatar + name */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#2f2f2f] flex items-center justify-center text-white font-semibold text-lg">
                        {tutor.name?.[0] || "?"}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {tutor.name}
                        </h3>
                        <p className="text-sm text-gray-500">{tutor.email}</p>
                      </div>
                    </div>

                    {/* Chat Button */}
                    <button
                      className="mt-2 px-4 py-2 rounded-lg bg-[#96aa97] text-white font-medium hover:bg-[#7f927f] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#96aa97]"
                    >
                      Chat
                    </button>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-5 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-gray-700 font-medium text-lg mb-1">
                  No Tutors Assigned
                </h3>
                <p className="text-gray-500 text-sm">
                  Your assigned tutors will appear here once allocated.
                </p>
              </div>
            )}
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
