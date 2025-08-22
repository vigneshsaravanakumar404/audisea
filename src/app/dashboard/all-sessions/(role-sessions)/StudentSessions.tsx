"use client"
import { Clock, Calendar, User, BookOpen } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useEffect } from "react";
import { Session } from "@/app/types/session";
import { useUser } from "@/app/contexts/userContext";
import { getStudentPastDates, getStudentUpcomingDates } from "@/data/firestore/student";
import { filterSessionsByDate } from "@/data/firestore/session";

export default function StudentAllSessions() {
  const user = useUser();
  const [selectedUpcomingDate, setSelectedUpcomingDate] = useState<Dayjs | null>(null);
  const [selectedPastDate, setSelectedPastDate] = useState<Dayjs | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]); 
  const [pastSessions, setPastSessions] = useState<Session[]>([]);
  const [pastDates, setPastDates] = useState<string[]>([]);
  const [upcomingDates, setUpcomingDates] = useState<string[]>([]);


  useEffect(() => {
    async function fetchDates() {
      if (user) {
        const pastDates = await getStudentPastDates(user.uid);
        setPastDates(pastDates);

        const upcomingDates = await getStudentUpcomingDates(user.uid);
        setUpcomingDates(upcomingDates);
      }
    }

    fetchDates();
  }, [user]);

  useEffect(() => {
    async function findUpcoming() {
      if (user && selectedUpcomingDate) {
        const upcomingSessions = await filterSessionsByDate(selectedUpcomingDate.format('YYYY-MM-DD'));
        setUpcomingSessions(upcomingSessions as Session[]);
        
      }
    }

    findUpcoming();
  }, [selectedUpcomingDate]);

  useEffect(() => {
    async function findPast() {
      if (user && selectedPastDate) {
        const pastSessions = await filterSessionsByDate(selectedPastDate.format('YYYY-MM-DD'));
        setPastSessions(pastSessions as Session[]);
        
      }
    }

    findPast();
  }, [selectedPastDate]);

  const formatDate = (date: Dayjs) => {
    return date.format('YYYY-MM-DD');
  };
  
  const isPastDateAvailable = (date: Dayjs) => {
    const dateStr = formatDate(date);
    return pastDates?.includes(dateStr) || false;
  };

  const isUpcomingDateAvailable = (date: Dayjs) => {
    const dateStr = formatDate(date);
    return upcomingDates?.includes(dateStr) || false;
  };

  
  const handlePastDateChange = (date: Dayjs | null) => {
    if (date) {
      if (isPastDateAvailable(date)) {
        setSelectedPastDate(date);
      }
    }
  };

  const handleUpcomingDateChange = (date: Dayjs | null) => {
    if (date) {
      if (isUpcomingDateAvailable(date)) {
        setSelectedUpcomingDate(date);
      }
    }
  };


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
            {/* Calendar View */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      value={selectedUpcomingDate}
                      onChange={handleUpcomingDateChange}
                      shouldDisableDate={(date) => {
                        // Disable dates that are NOT available
                        return !isUpcomingDateAvailable(date);
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiPickersDay-root': {
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: '"Josefin Sans", sans-serif',
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
                          border: '2px solid #96aa97',
                          '&:hover': {
                            backgroundColor: '#f0f4f0',
                          },
                        },
                        '& .MuiPickersDay-root.MuiDay-today': {
                          border: '2px solid #96aa97 !important',
                          backgroundColor: 'transparent !important',
                          outline: 'none !important',
                          boxShadow: 'none !important',
                          color: '#2f2f2f !important',
                          position: 'relative',
                          '&:before': { 
                            content: '""',
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#96aa97',
                            borderRadius: '50%',
                            display: 'block !important'
                          },
                          '&:after': { display: 'none !important' },
                        },
                        '& .MuiPickersDay-root.MuiDay-today.Mui-selected': {
                          backgroundColor: '#96aa97 !important',
                          color: 'white !important',
                          '&:before': { 
                            content: '""',
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'block !important'
                          },
                        },
                        '& .MuiPickersCalendarHeader-root': {
                          color: '#2f2f2f',
                        },
                        '& .MuiPickersCalendarHeader-label': {
                          fontSize: '15px',
                          fontWeight: 600,
                          fontFamily: '"Josefin Sans", sans-serif',
                        },
                        '& .MuiPickersCalendarHeader-switchViewButton': {
                          color: '#96aa97',
                        },
                      }}
                    />
                  </LocalizationProvider>

                  {/* Legend */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#96aa97] rounded border-2 border-[#96aa97]"></div>
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-50 rounded border-2 border-gray-200"></div>
                        <span className="text-gray-600">Unavailable</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <div key={session.uid} className="flex items-center justify-between bg-[#f8faf8] rounded-xl p-5 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-[#96aa97]" />
                        <div>
                          <div className="font-semibold text-[#2f2f2f] text-lg">{dayjs(session.date).format('ddd, MMM D')}</div>
                          <div className="text-gray-600 text-sm">{session.startTime} - {session.endTime}</div>
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
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={selectedPastDate}
                    onChange={handlePastDateChange}
                    shouldDisableDate={(date) => {
                      // Disable dates that are NOT available
                      return !isPastDateAvailable(date);
                    }}
                    sx={{
                      width: '%',
                      '& .MuiPickersDay-root': {
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: '"Josefin Sans", sans-serif',
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
                        border: '2px solid #96aa97',
                        '&:hover': {
                          backgroundColor: '#f0f4f0',
                        },
                      },
                      '& .MuiPickersDay-root.MuiDay-today': {
                        border: 'none !important',
                        backgroundColor: 'transparent !important',
                        outline: 'none !important',
                        boxShadow: 'none !important',
                        color: '#2f2f2f !important',
                        '&:before': { display: 'none !important' },
                        '&:after': { display: 'none !important' },
                      },
                      '& .MuiPickersDay-today': {
                        border: 'none !important',
                      },
                      '& .MuiPickersCalendarHeader-root': {
                        color: '#2f2f2f',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        fontSize: '15px',
                        fontWeight: 600,
                        fontFamily: '"Josefin Sans", sans-serif',
                      },
                      '& .MuiPickersCalendarHeader-switchViewButton': {
                        color: '#96aa97',
                      },
                    }}
                  />
                </LocalizationProvider>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#96aa97] rounded border-2 border-[#96aa97]"></div>
                      <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-50 rounded border-2 border-gray-200"></div>
                      <span className="text-gray-600">Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
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
                    <div key={session.uid} className="flex items-center justify-between bg-[#f8faf8] rounded-xl p-5 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <Clock className="w-6 h-6 text-[#96aa97]" />
                        <div>
                          <div className="font-semibold text-[#2f2f2f] text-lg">{dayjs(session.date).format('ddd, MMM D')}</div>
                          <div className="text-gray-600 text-sm">{session.startTime } - {session.endTime}</div>
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