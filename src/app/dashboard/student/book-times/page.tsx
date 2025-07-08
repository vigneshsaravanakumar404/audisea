"use client"

import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, BookOpen, CheckCircle, ChevronRight, ChevronLeft, X } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from "@/app/contexts/authContext";
import { UserInfo } from "@/app/types/user";  
import { getUserData } from "@/data/firestore/user";

export default function BookTimes () {
  const { currentUser } = useAuth();
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<Array<{date: string, time: string}>>([]);

  // Mock tutor availability data - in real app this would come from API
  const tutorAvailability = {
    "tutor1": [
      "2024-12-15", "2024-12-16", "2024-12-17", "2024-12-18", "2024-12-19",
      "2024-12-20", "2024-12-21", "2024-12-22", "2024-12-23", "2024-12-24",
      "2024-12-25", "2024-12-26", "2024-12-27", "2024-12-28", "2024-12-29",
      "2024-12-30", "2024-12-31"
    ],
    "tutor2": [
      "2024-12-15", "2024-12-17", "2024-12-19", "2024-12-21", "2024-12-23",
      "2024-12-25", "2024-12-27", "2024-12-29", "2024-12-31"
    ],
    "tutor3": [
      "2024-12-16", "2024-12-18", "2024-12-20", "2024-12-22", "2024-12-24",
      "2024-12-26", "2024-12-28", "2024-12-30"
    ],
    "tutor4": [
      "2024-12-15", "2024-12-16", "2024-12-17", "2024-12-18", "2024-12-19",
      "2024-12-20", "2024-12-21", "2024-12-22", "2024-12-23", "2024-12-24",
      "2024-12-25", "2024-12-26", "2024-12-27", "2024-12-28", "2024-12-29",
      "2024-12-30", "2024-12-31"
    ]
  };

  // Time slot data for mapping
  const timeSlots = [
    { id: 1, time: "5:00 PM - 6:00 PM", available: true },
    { id: 2, time: "6:00 PM - 7:00 PM", available: true },
    { id: 3, time: "7:00 PM - 8:00 PM", available: true },
    { id: 4, time: "8:00 PM - 9:00 PM", available: true },
    { id: 5, time: "9:00 PM - 10:00 PM", available: false },
    { id: 6, time: "10:00 PM - 11:00 PM", available: false },
    { id: 7, time: "11:00 PM - 12:00 AM", available: false },
  ];

  const formatDate = (date: Dayjs) => {
    return date.format('YYYY-MM-DD');
  };

  const isDateAvailable = (date: Dayjs) => {
    if (!selectedTutor) return false;
    const dateStr = formatDate(date);
    return tutorAvailability[selectedTutor as keyof typeof tutorAvailability]?.includes(dateStr) || false;
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      // Allow selection if date is available, or if no tutor is selected yet
      if (isDateAvailable(date) || !selectedTutor) {
        setSelectedDate(date);
      }
    }
  };

  // Handle session selection
  const handleSessionToggle = (date: string, time: string) => {
    const sessionKey = `${date}-${time}`;
    setSelectedSessions(prev => {
      const exists = prev.some(session => `${session.date}-${session.time}` === sessionKey);
      if (exists) {
        return prev.filter(session => `${session.date}-${session.time}` !== sessionKey);
      } else {
        return [...prev, { date, time }];
      }
    });
  };

  // Check if a specific session is selected
  const isSessionSelected = (date: string, time: string) => {
    return selectedSessions.some(session => session.date === date && session.time === time);
  };

  // Get sessions for a specific date
  const getSessionsForDate = (date: string) => {
    return selectedSessions.filter(session => session.date === date);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTutor || !selectedSubject || selectedSessions.length === 0) {
      alert("Please fill in all required fields and select at least one session.");
      return;
    }

    // Here you would typically send the data to your backend
    const bookingData = {
      tutor: selectedTutor,
      subject: selectedSubject,
      sessions: selectedSessions,
      totalSessions: selectedSessions.length
    };

    console.log("Booking data:", bookingData);
    alert(`Sessions booked successfully! You have booked ${bookingData.totalSessions} session${bookingData.totalSessions !== 1 ? 's' : ''}. You will receive a confirmation email shortly.`);
    
    // Reset form
    setSelectedTutor("");
    setSelectedSubject("");
    setSelectedSessions([]);
    setSelectedDate(null);
  };

  // Handle form reset
  const handleReset = () => {
    setSelectedTutor("");
    setSelectedSubject("");
    setSelectedSessions([]);
    setSelectedDate(null);
  };

  // Check if form is valid
  const isFormValid = selectedTutor && selectedSubject && selectedSessions.length > 0;

  return (
    <div className="bg-[#fbf8f6] min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Professional Header */}
        <header className="w-full h-36 bg-[#6e7d6f] px-[74px] flex items-center">
          <h1 className="font-bold text-[#fbf8f6] text-4xl tracking-tight">
            Schedule Your Sessions
          </h1>
        </header>

        {/* Main Content */}
        <main className="px-8 py-12">
          <div className="max-w-6xl mx-auto space-y-12">


            <form onSubmit={handleSubmit} className="space-y-12">

              {/* Tutor & Subject Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tutor Selection */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#2f2f2f]">Select Your Tutor</h2>
                        <p className="text-gray-600 text-sm">Choose from our qualified educators</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <select 
                      value={selectedTutor}
                      onChange={(e) => {
                        setSelectedTutor(e.target.value);
                        setSelectedSessions([]); // Reset sessions when tutor changes
                        setSelectedDate(null); // Reset selected date when tutor changes
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-lg font-medium text-[#2f2f2f] focus:outline-none focus:border-[#96aa97] focus:ring-4 focus:ring-[#96aa97]/10 transition-all"
                      required
                    >
                      
                      <option value="">Choose a tutor...</option>
                      <option value="tutor1">Dr. Sarah Johnson - Mathematics</option>
                      <option value="tutor2">Prof. Michael Chen - Physics</option>
                      <option value="tutor3">Ms. Emily Davis - English Literature</option>
                      <option value="tutor4">Dr. James Wilson - Chemistry</option>
                    </select>
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#2f2f2f]">Choose Your Subject</h2>
                        <p className="text-gray-600 text-sm">Select the topic you want to study</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <select 
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-lg font-medium text-[#2f2f2f] focus:outline-none focus:border-[#96aa97] focus:ring-4 focus:ring-[#96aa97]/10 transition-all"
                      required
                    >
                      <option value="">Select a subject...</option>
                      <option value="math">Advanced Mathematics</option>
                      <option value="physics">Physics</option>
                      <option value="english">English Literature</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="biology">Biology</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Session Selection */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#2f2f2f]">Select Your Sessions</h2>
                      <p className="text-gray-600 text-sm">Choose specific dates and times for your sessions</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar View */}
                    <div className="lg:col-span-1">
                      <h3 className="text-lg font-semibold text-[#2f2f2f] mb-4">Available Dates</h3>
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateCalendar
                            value={selectedDate}
                            onChange={handleDateChange}
                            shouldDisableDate={(date) => {
                              // Disable dates that are NOT available
                              return !isDateAvailable(date);
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
                                '&:hover': {
                                  backgroundColor: '#f0f4f0',
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

                    {/* Session Selection */}
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-[#2f2f2f] mb-4">Available Sessions</h3>
                      {!selectedTutor ? (
                        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">Please select a tutor first to view available sessions</p>
                        </div>
                      ) : !selectedDate ? (
                        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">Please select a date from the calendar to view available time slots</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-[#f0f4f0] rounded-xl p-4 border border-[#96aa97]">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-[#2f2f2f] text-lg">
                                {selectedDate?.format('dddd, MMMM D, YYYY')}
                              </h4>
                              <span className="text-sm text-gray-600">
                                {getSessionsForDate(selectedDate?.format('YYYY-MM-DD') || '').length} selected
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {timeSlots.map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => slot.available && handleSessionToggle(selectedDate?.format('YYYY-MM-DD') || '', slot.time)}
                                  disabled={!slot.available}
                                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    !slot.available 
                                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : isSessionSelected(selectedDate?.format('YYYY-MM-DD') || '', slot.time)
                                        ? 'border-[#96aa97] bg-[#f0f4f0] text-[#2f2f2f] shadow-sm' 
                                        : 'border-gray-200 bg-white text-[#2f2f2f] hover:border-[#96aa97] hover:bg-[#f8faf8]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <Clock className={`w-5 h-5 ${isSessionSelected(selectedDate?.format('YYYY-MM-DD') || '', slot.time) ? 'text-[#96aa97]' : 'text-gray-400'}`} />
                                      <span className="font-medium text-lg">{slot.time}</span>
                                    </div>
                                    {isSessionSelected(selectedDate?.format('YYYY-MM-DD') || '', slot.time) && (
                                      <CheckCircle className="w-5 h-5 text-[#96aa97]" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              {(selectedTutor || selectedSubject || selectedSessions.length > 0) && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#2f2f2f]">Booking Summary</h2>
                        <p className="text-gray-600 text-sm">Review your session details before booking</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Session Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-[#2f2f2f] mb-4">Session Details</h3>
                        <div className="space-y-4">
                          {selectedTutor && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <User className="w-5 h-5 text-[#96aa97]" />
                              <div>
                                <p className="text-sm text-gray-600">Tutor</p>
                                <p className="font-medium text-[#2f2f2f]">
                                  {selectedTutor === "tutor1" && "Dr. Sarah Johnson - Mathematics"}
                                  {selectedTutor === "tutor2" && "Prof. Michael Chen - Physics"}
                                  {selectedTutor === "tutor3" && "Ms. Emily Davis - English Literature"}
                                  {selectedTutor === "tutor4" && "Dr. James Wilson - Chemistry"}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedSubject && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <BookOpen className="w-5 h-5 text-[#96aa97]" />
                              <div>
                                <p className="text-sm text-gray-600">Subject</p>
                                <p className="font-medium text-[#2f2f2f]">
                                  {selectedSubject === "math" && "Advanced Mathematics"}
                                  {selectedSubject === "physics" && "Physics"}
                                  {selectedSubject === "english" && "English Literature"}
                                  {selectedSubject === "chemistry" && "Chemistry"}
                                  {selectedSubject === "biology" && "Biology"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selected Sessions */}
                      <div>
                        <h3 className="text-lg font-semibold text-[#2f2f2f] mb-4">Selected Sessions</h3>
                        {selectedSessions.length > 0 ? (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {selectedSessions.map((session, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-[#f0f4f0] rounded-lg border border-[#96aa97]">
                                <div className="flex items-center space-x-3">
                                  <Calendar className="w-4 h-4 text-[#96aa97]" />
                                  <div>
                                    <p className="font-medium text-[#2f2f2f] text-sm">
                                      {dayjs(session.date).format('ddd, MMM D')}
                                    </p>
                                    <p className="text-gray-600 text-xs">{session.time}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSessionToggle(session.date, session.time)}
                                  className="p-1 hover:bg-[#96aa97] hover:text-white rounded transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">No sessions selected</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total Summary */}
                    {isFormValid && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-[#96aa97] to-[#86998a] rounded-xl text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-lg">Ready to Book!</p>
                            <p className="text-[#e8f0e9] text-sm">
                              {selectedSessions.length} session{selectedSessions.length !== 1 ? 's' : ''} with {
                                selectedTutor === "tutor1" && "Dr. Sarah Johnson"
                                || selectedTutor === "tutor2" && "Prof. Michael Chen"
                                || selectedTutor === "tutor3" && "Ms. Emily Davis"
                                || selectedTutor === "tutor4" && "Dr. James Wilson"
                              }
                            </p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
                <button 
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold px-8 py-4 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Clear Selection
                </button>
                <button 
                  type="submit"
                  disabled={!isFormValid}
                  onClick={handleSubmit}
                  className={`w-full sm:w-auto text-lg font-semibold px-12 py-4 rounded-xl shadow-lg transition-all duration-200 ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-[#96aa97] to-[#86998a] text-white hover:shadow-xl transform hover:-translate-y-0.5' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Book Sessions
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}