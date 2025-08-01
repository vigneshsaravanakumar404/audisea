"use client"
import { Clock, Calendar, User, BookOpen } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useEffect } from "react";
import { Session } from "@/app/types/session";

const mockUpcomingSessions = [
  {
    id: 1,
    date: "2024-12-20",
    time: "5:00 PM - 6:00 PM",
    subject: "Mathematics",
    tutor: "Dr. Sarah Johnson"
  },
  {
    id: 2,
    date: "2024-12-22",
    time: "6:00 PM - 7:00 PM",
    subject: "Physics",
    tutor: "Prof. Michael Chen"
  }
];

const mockPastSessions = [
  {
    id: 1,
    date: "2024-11-10",
    time: "5:00 PM - 6:00 PM",
    subject: "English Literature",
    tutor: "Ms. Emily Davis"
  },
  {
    id: 2,
    date: "2025-07-03",
    time: "7:00 PM - 8:00 PM",
    subject: "Chemistry",
    tutor: "Dr. James Wilson"
  }
];

export default function StudentAllSessions() {
  const [selectedUpcomingDate, setSelectedUpcomingDate] = useState<Dayjs>(dayjs());
  const [selectedPastDate, setSelectedPastDate] = useState<Dayjs>(dayjs());
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]); 
  const [pastSessions, setPastSessions] = useState<Session[]>([]);

  const upcomingSessionsFilter = (date: Dayjs) => {
    const format = date?.format('YYYY-MM-DD');
    setUpcomingSessions(mockUpcomingSessions.filter(session => session.date === format))
  };

  
  const pastSessionsFilter = (date: Dayjs) => {
    const format = date?.format('YYYY-MM-DD');
    setPastSessions(mockPastSessions.filter(session => session.date === format))
  };

  useEffect(() => {
    upcomingSessionsFilter(selectedUpcomingDate);
    pastSessionsFilter(selectedPastDate);
  }, [selectedUpcomingDate, selectedPastDate]);



  return (
    <div className="bg-[#fbf8f6] min-h-screen">
      <div>
        {/* Header */}
        <header className="w-full h-36 bg-[#6e7d6f] px-[74px] flex items-center">
          <h1 className="font-bold text-[#fbf8f6] text-4xl tracking-tight font-['Josefin_Sans',sans-serif]">
            All Sessions
          </h1>
        </header>

        {/* Main Content */}
        <main className="px-8 py-12 space-y-12">
          {/* Row 1: Upcoming */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Upcoming Calendar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center w-full">
              <h2 className="font-semibold text-[#2f2f2f] text-xl mb-4 font-['Josefin_Sans',sans-serif]">Upcoming Sessions Calendar</h2>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedUpcomingDate}
                  onChange={(newDate) => {
                    if (newDate !== null) {
                      setSelectedUpcomingDate(newDate);
                    }
                  }}
                  sx={{
                    width: '100%',
                    minWidth: 320,
                    maxWidth: 380,
                    mx: 'auto',
                    '& .MuiPickersDay-root': {
                      fontSize: '15px',
                      fontWeight: 500,
                      fontFamily: '"Josefin Sans", sans-serif',
                      borderRadius: '10px',
                      transition: 'all 0.2s',
                    },
                    '& .MuiPickersDay-root.Mui-selected': {
                      backgroundColor: '#96aa97 !important',
                      color: 'white !important',
                      '&:hover': {
                        backgroundColor: '#86998a !important',
                      },
                    },
                    '& .MuiPickersDay-root.Mui-selected.Mui-focusVisible': {
                      backgroundColor: '#96aa97 !important',
                      color: 'white !important',
                    },
                    '& .MuiPickersDay-root.Mui-disabled': {
                      color: '#9ca3af',
                    },
                    '& .MuiPickersDay-root:not(.Mui-disabled)': {
                      color: '#2f2f2f',
                      '&:hover': {
                        backgroundColor: '#f0f4f0',
                      },
                    },
                    '& .MuiPickersCalendarHeader-root': {
                      color: '#2f2f2f',
                      mb: 2,
                    },
                    '& .MuiPickersCalendarHeader-label': {
                      fontSize: '17px',
                      fontWeight: 700,
                      fontFamily: '"Josefin Sans", sans-serif',
                      letterSpacing: '0.5px',
                    },
                    '& .MuiPickersCalendarHeader-switchViewButton': {
                      color: '#96aa97',
                    },
                    '& .MuiPickersSlideTransition-root': {
                      minHeight: 280,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            {/* Upcoming Sessions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col justify-between h-full">
              <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2f2f2f] font-['Josefin_Sans',sans-serif]">Upcoming Sessions</h2>
                    <p className="text-gray-600 text-sm">All your scheduled sessions</p>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col gap-4">
                {upcomingSessions.length === 0 ? (
                  <div className="text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-5">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-700 font-medium text-lg mb-1">No Upcoming Sessions</h3>
                    <p className="text-gray-500 text-sm">You haven't scheduled any upcoming sessions.</p>
                  </div>
                ) : (
                  upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between bg-[#f8faf8] rounded-xl p-5 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-[#96aa97]" />
                        <div>
                          <div className="font-semibold text-[#2f2f2f] text-lg">{dayjs(session.date).format('ddd, MMM D')}</div>
                          <div className="text-gray-600 text-sm">{session.time}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <BookOpen className="w-4 h-4 text-[#96aa97]" />
                          {session.subject}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <User className="w-4 h-4 text-[#96aa97]" />
                          {session.tutor}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Past */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Past Calendar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center w-full">
              <h2 className="font-semibold text-[#2f2f2f] text-xl mb-4 font-['Josefin_Sans',sans-serif]">Past Sessions Calendar</h2>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedPastDate}
                  onChange={(newDate) => {
                    if (newDate !== null) {
                      setSelectedPastDate(newDate);
                    }
                  }}
                  sx={{
                    width: '100%',
                    minWidth: 320,
                    maxWidth: 380,
                    mx: 'auto',
                    '& .MuiPickersDay-root': {
                      fontSize: '15px',
                      fontWeight: 500,
                      fontFamily: '"Josefin Sans", sans-serif',
                      borderRadius: '10px',
                      transition: 'all 0.2s',
                    },
                    '& .MuiPickersDay-root.Mui-selected': {
                      backgroundColor: '#96aa97 !important',
                      color: 'white !important',
                      '&:hover': {
                        backgroundColor: '#86998a !important',
                      },
                    },
                    '& .MuiPickersDay-root.Mui-selected.Mui-focusVisible': {
                      backgroundColor: '#96aa97 !important',
                      color: 'white !important',
                    },
                    '& .MuiPickersDay-root.Mui-disabled': {
                      color: '#9ca3af',
                    },
                    '& .MuiPickersDay-root:not(.Mui-disabled)': {
                      color: '#2f2f2f',
                      '&:hover': {
                        backgroundColor: '#f0f4f0',
                      },
                    },
                    '& .MuiPickersCalendarHeader-root': {
                      color: '#2f2f2f',
                      mb: 2,
                    },
                    '& .MuiPickersCalendarHeader-label': {
                      fontSize: '17px',
                      fontWeight: 700,
                      fontFamily: '"Josefin Sans", sans-serif',
                      letterSpacing: '0.5px',
                    },
                    '& .MuiPickersCalendarHeader-switchViewButton': {
                      color: '#96aa97',
                    },
                    '& .MuiPickersSlideTransition-root': {
                      minHeight: 280,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            {/* Past Sessions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col justify-between h-full">
              <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2f2f2f] font-['Josefin_Sans',sans-serif]">Past Sessions</h2>
                    <p className="text-gray-600 text-sm">Your completed sessions will appear here</p>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col gap-4">
                {pastSessions.length === 0 ? (
                  <div className="text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-5">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-700 font-medium text-lg mb-1">No Past Sessions</h3>
                    <p className="text-gray-500 text-sm">Your completed sessions will appear here.</p>
                  </div>
                ) : (
                  pastSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between bg-[#f8faf8] rounded-xl p-5 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <Clock className="w-6 h-6 text-[#96aa97]" />
                        <div>
                          <div className="font-semibold text-[#2f2f2f] text-lg">{dayjs(session.date).format('ddd, MMM D')}</div>
                          <div className="text-gray-600 text-sm">{session.time}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <BookOpen className="w-4 h-4 text-[#96aa97]" />
                          {session.subject}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <User className="w-4 h-4 text-[#96aa97]" />
                          {session.tutor}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}