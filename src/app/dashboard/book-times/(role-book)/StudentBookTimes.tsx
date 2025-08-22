"use client"

import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, BookOpen, CheckCircle, X, Settings } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { useUser } from "@/app/contexts/userContext";
import { getStudentTutors, getStudentDataRef, addStudentUpcomingDates } from "@/data/firestore/student";
import { getTutorDataRef } from "@/data/firestore/tutor";
import { setSessionData } from "@/data/firestore/session";
import { Tutor } from "@/app/types/user";
import { v4 as uuidv4 } from "uuid"; 
import { Session } from "@/app/types/session";

export default function StudentBookTimes() {
    const user = useUser();
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedSessions, setSelectedSessions] = useState<Array<{date: string, time: string}>>([]);
    const [tutors, setTutors] = useState<Tutor[] | null>([]);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    // Show toast notification
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000); // Auto-hide after 4 seconds
    };

    const formatToAmPm = (time24: string) =>
        time24 ? dayjs(time24, "HH:mm").format("h:mm A") : "";

    // NEW: add/toggle custom range into selectedSessions
    const handleCustomTimeSubmit = () => {
        if (!selectedDate) {
            showToast("Please select a date first.", 'warning');
            return;
        }
        if (!customStart || !customEnd) {
            showToast("Please enter both start and end times.", 'warning');
            return;
        }

        if (customStart >= customEnd) {
            showToast("End time must be later than start time.", 'error');
            return;
        }

        const dateStr = selectedDate.format("YYYY-MM-DD");
        const customRange = `${formatToAmPm(customStart)} - ${formatToAmPm(customEnd)}`;

        setSelectedSessions(prev => {
            const exists = prev.some(s => s.date === dateStr && s.time === customRange);
            return exists
                ? prev.filter(s => !(s.date === dateStr && s.time === customRange))
                : [...prev, { date: dateStr, time: customRange }];
        });

        // reset inputs
        setCustomStart("");
        setCustomEnd("");
        showToast("Custom time range added successfully!", 'success');
    };

    useEffect(() => {
        async function fetchTutors() {
            if (user) {
                try {
                    setLoading(true);
                    const tutors = await getStudentTutors(user.uid);
                    setTutors(tutors);
                } catch (error) {
                    console.error('Error fetching tutors:', error);
                    showToast('Error loading tutors. Please try again.', 'error');
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchTutors();
    }, [user]);

    useEffect(() => {
        if (selectedTutor) {
            setSubjects(selectedTutor.subjects);
            const formattedDates = selectedTutor.datesAvailable.map(dateStr =>
                formatDate(dayjs(dateStr))
            );
            setDates(formattedDates);
        }
    }, [selectedTutor]);

    const formatDate = (date: Dayjs) => {
        return date.format('YYYY-MM-DD');
    };

    const isDateAvailable = (date: Dayjs) => {
        if (!selectedTutor) return false;
        const dateStr = formatDate(date);
        return dates?.includes(dateStr) || false;
    };

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
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

    // Get sessions for a specific date
    const getSessionsForDate = (date: string) => {
        return selectedSessions.filter(session => session.date === date);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!selectedTutor || !selectedSubject || selectedSessions.length === 0) {
            showToast("Please fill in all required fields and select at least one session.", 'warning');
            return;
        }

        try {
            setBooking(true);

            for (const session of selectedSessions) {
                const bookingData: Session = {
                    uid: "", // or Firestore auto-ID later
                    date: session.date,
                    startTime: session.time.split(" - ")[0],
                    endTime: session.time.split(" - ")[1],
                    student: user.name,
                    tutor: selectedTutor.name,
                    studentRef: getStudentDataRef(user.uid),
                    tutorRef: getTutorDataRef(selectedTutor.uid),
                    meetURL: "",
                    subject: selectedSubject,
                    description: `Nothing Updated`,
                };

                await setSessionData(bookingData);
                await addStudentUpcomingDates(user.uid, bookingData.date);
            }

            showToast(`Successfully booked ${selectedSessions.length} session${selectedSessions.length !== 1 ? 's' : ''}!`, 'success');

            // Reset form
            setSelectedTutor(null);
            setSelectedSubject("");
            setSelectedSessions([]);
            setSelectedDate(null);

        } catch (error) {
            console.error('Error booking sessions:', error);
            showToast('Error booking sessions. Please try again.', 'error');
        } finally {
            setBooking(false);
        }
    };

    // Handle form reset
    const handleReset = () => {
        setSelectedTutor(null);
        setSelectedSubject("");
        setSelectedSessions([]);
        setSelectedDate(null);
        showToast('Selection cleared.', 'success');
    };

    // Check if form is valid
    const isFormValid = selectedTutor && selectedSubject && selectedSessions.length > 0;

    if (loading) {
        return (
            <div className="bg-[#fbf8f6] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#96aa97] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tutors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fbf8f6] min-h-screen">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transition-all duration-300 ${toast.type === 'success' ? 'bg-green-500 text-white' :
                    toast.type === 'error' ? 'bg-red-500 text-white' :
                        'bg-yellow-500 text-white'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {toast.type === 'error' && <X className="w-5 h-5" />}
                            {toast.type === 'warning' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            )}
                            <span className="font-medium">{toast.message}</span>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-4 text-white hover:text-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
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
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold text-[#2f2f2f]">Select Your Tutor</h2>
                                                <p className="text-gray-600 text-sm">Choose from our qualified educators</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <select
                                            value={selectedTutor?.uid || ""}
                                            onChange={(e) => {
                                                const uid = e.target.value;
                                                const tutor = tutors?.find(t => t.uid === uid) || null;
                                                setSelectedTutor(tutor);
                                            }}
                                            className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-lg font-medium text-[#2f2f2f] focus:outline-none focus:border-[#96aa97] focus:ring-4 focus:ring-[#96aa97]/10 transition-all"
                                            required
                                        >
                                            <option value="">Select Tutor</option>
                                            {tutors?.map(tutor => (
                                                <option key={tutor.uid} value={tutor.uid}>
                                                    {tutor.name}
                                                </option>
                                            ))}
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
                                            <div className="flex-1">
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
                                            {subjects?.map((subject, index) => (
                                                <option key={index} value={subject}>
                                                    {subject}
                                                </option>
                                            ))}
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
                                        <div className="flex-1">
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

                                        {/* Session Selection */}
                                        <div className="lg:col-span-2">
                                            <h3 className="text-lg font-semibold text-[#2f2f2f] mb-4">Choose Your Sessions</h3>

                                            {!selectedTutor ? (
                                                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                                                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-600 font-medium">
                                                        Please select a tutor first to view available sessions
                                                    </p>
                                                </div>
                                            ) : !selectedDate ? (
                                                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                                                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-600 font-medium">
                                                        Please select a date from the calendar to view available time slots
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="bg-[#f0f4f0] rounded-xl p-4 border border-[#96aa97]">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="font-semibold text-[#2f2f2f] text-lg">
                                                                {selectedDate?.format("dddd, MMMM D, YYYY")}
                                                            </h4>
                                                        </div>

                                                        <div className="mb-6">
                                                            <div className="text-sm text-gray-700">
                                                                <div className="flex items-center space-x-2 mb-3">
                                                                    <div className="w-6 h-6 bg-[#96aa97] rounded-lg flex items-center justify-center">
                                                                        <Clock className="w-3 h-3 text-white" />
                                                                    </div>
                                                                    <span className="font-semibold text-gray-800 text-base">Available Time Slots</span>
                                                                </div>
                                                                {(() => {
                                                                    const dateStr = selectedDate?.format("YYYY-MM-DD") || "";
                                                                    const timeSlots = selectedTutor.timeSlots[dateStr];
                                                                    
                                                                    if (!timeSlots || timeSlots.length === 0) {
                                                                        return (
                                                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                                                                                <div className="flex items-center space-x-3">
                                                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-blue-800 font-medium">No specific time slots set</p>
                                                                                        <p className="text-blue-600 text-sm">You can suggest custom times below</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    
                                                                    return (
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                            {Array.isArray(timeSlots) ? timeSlots.map((slot: string, index: number) => {
                                                                                // Convert 24-hour format to 12-hour format
                                                                                const [start, end] = slot.split('-');
                                                                                const formatToAmPm = (time24: string) => {
                                                                                    if (!time24) return '';
                                                                                    return dayjs(time24, "HH:mm").format("h:mm A");
                                                                                };
                                                                                const formattedSlot = `${formatToAmPm(start)} - ${formatToAmPm(end)}`;
                                                                                
                                                                                return (
                                                                                    <div 
                                                                                        key={index} 
                                                                                        className="group bg-white border-2 border-[#96aa97]/20 rounded-xl p-3 hover:border-[#96aa97] hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                                                                        onClick={() => {
                                                                                            // Auto-fill the custom time inputs with this slot
                                                                                            if (start && end) {
                                                                                                setCustomStart(start);
                                                                                                setCustomEnd(end);
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div className="flex items-center space-x-3">
                                                                                                <div className="w-8 h-8 bg-gradient-to-br from-[#96aa97] to-[#86998a] rounded-lg flex items-center justify-center shadow-sm">
                                                                                                    <Clock className="w-4 h-4 text-white" />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <span className="text-gray-900 font-semibold text-sm">{formattedSlot}</span>
                                                                                                    <p className="text-gray-500 text-xs">Click to use this time</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }) : (
                                                                                <div 
                                                                                    className="group bg-white border-2 border-[#96aa97]/20 rounded-xl p-3 hover:border-[#96aa97] hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                                                                    onClick={() => {
                                                                                        // Auto-fill the custom time inputs with this slot
                                                                                        const [start, end] = timeSlots.split('-');
                                                                                        if (start && end) {
                                                                                            setCustomStart(start);
                                                                                            setCustomEnd(end);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center space-x-3">
                                                                                            <div className="w-8 h-8 bg-gradient-to-br from-[#96aa97] to-[#86998a] rounded-lg flex items-center justify-center shadow-sm">
                                                                                                <Clock className="w-4 h-4 text-white" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <span className="text-gray-900 font-semibold text-sm">{timeSlots}</span>
                                                                                                <p className="text-gray-500 text-xs">Click to use this time</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>

                                                        {/* Custom time input (start → end) */}
                                                        <div className="mt-6">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Suggest a custom time
                                                            </label>
                                                            <div className="flex flex-col sm:flex-row gap-3">
                                                                <input
                                                                    type="time"
                                                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#96aa97] text-black focus:outline-none"
                                                                    value={customStart}
                                                                    onChange={(e) => setCustomStart(e.target.value)}
                                                                />
                                                                <span className="self-center text-gray-600 font-medium">to</span>
                                                                <input
                                                                    type="time"
                                                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#96aa97] text-black focus:outline-none"
                                                                    value={customEnd}
                                                                    onChange={(e) => setCustomEnd(e.target.value)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={handleCustomTimeSubmit}
                                                                    className="rounded-lg bg-[#96aa97] text-white px-4 py-2 text-sm font-medium hover:bg-[#86998a] transition-colors"
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>
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
                                            <div className="flex-1">
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
                                                                    {selectedTutor.name}
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
                                                                    {selectedSubject}
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
                                                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
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
                                                                selectedTutor!.name
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
                                    disabled={!isFormValid || booking}
                                    onClick={handleSubmit}
                                    className={`w-full sm:w-auto text-lg font-semibold px-12 py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                                        isFormValid && !booking
                                            ? 'bg-gradient-to-r from-[#96aa97] to-[#86998a] text-white hover:shadow-xl transform hover:-translate-y-0.5' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {booking ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Booking...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Settings className="w-4 h-4" />
                                            <span>Book Sessions</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            
        </div>
    );
}
