"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X, Settings } from 'lucide-react';
import { useAuth } from '@/app/contexts/authContext';
import { useUser } from '@/app/contexts/userContext';
import { TutorSchema } from '@/data/schemas';
import { FirebaseUtils } from '@/data/firebase/utils';
import { logToServer } from '@/utils/logger';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export default function AvailabilitiesPage() {
    const user = useUser();

    // Check if user is a tutor, show not found for others
    if (user?.userType !== "tutor") {
        return (
            <div className="bg-[#fbf8f6] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 text-lg">This page is only accessible to tutors.</p>
                </div>
            </div>
        );
    }

    return (
        <AvailabilityScheduler />
    )
}

const AvailabilityScheduler = () => {
    const { currentUser } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [tutorData, setTutorData] = useState<TutorSchema | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [timeRanges, setTimeRanges] = useState<string[]>([]);
    const [newTimeRange, setNewTimeRange] = useState({ start: '09:00', end: '10:00' });

    // Generate time options for the dropdowns
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 6; hour <= 22; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            options.push(time);
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    // Fetch tutor data from Firestore
    useEffect(() => {
        const fetchTutorData = async () => {
            if (!currentUser?.uid) return;

            try {
                setLoading(true);
                const tutorData = await FirebaseUtils.getOrCreateTutor(
                    currentUser.uid,
                    currentUser.displayName || 'Unknown',
                    currentUser.email || '',
                    currentUser.photoURL || ''
                );
                setTutorData(tutorData);

                // Initialize time ranges based on Firebase data
                initializeTimeRanges(tutorData);

                // Log to server terminal
                await logToServer('=== FIREBASE TUTOR DATA ===');
                await logToServer(`Tutor UID: ${tutorData.uid}`);
                await logToServer(`Tutor Name: ${tutorData.name}`);
                await logToServer(`Tutor Email: ${tutorData.email}`);
                await logToServer(`Available Dates: ${JSON.stringify(tutorData.datesAvailable)}`);
                await logToServer(`Time Slots: ${JSON.stringify(tutorData.timeSlots)}`);
                await logToServer(`Subjects: ${JSON.stringify(tutorData.subjects)}`);
                await logToServer('==========================');

            } catch (error) {
                console.error('Error fetching/creating tutor data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorData();
    }, [currentUser?.uid]);

    // Initialize time ranges based on Firebase data for selected date
    const initializeTimeRanges = async (data: TutorSchema) => {
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        const timeSlotsForDate = data.timeSlots[selectedDateStr] || [];
        setTimeRanges(timeSlotsForDate);

        await logToServer(`=== TIME RANGES FOR ${selectedDateStr} ===`);
        await logToServer(`Time ranges from Firebase: ${JSON.stringify(timeSlotsForDate)}`);
        await logToServer('==============================');
    };

    // Parse dates from the database
    const parseAvailableDates = () => {
        if (!tutorData?.datesAvailable || !Array.isArray(tutorData.datesAvailable)) {
            return [];
        }

        return tutorData.datesAvailable.map((dateStr: string) => {
            const date = new Date(dateStr);
            return {
                date: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                fullDate: dateStr
            };
        });
    };

    // Get time slots for a specific date
    const getTimeSlotsForDate = (dateStr: string) => {
        if (!tutorData?.timeSlots || typeof tutorData.timeSlots !== 'object') {
            return null;
        }
        return tutorData.timeSlots[dateStr];
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() - 1);
            return newMonth;
        });
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + 1);
            return newMonth;
        });
    };

    // Handle date selection
    const handleDateSelect = async (day: number) => {
        const newSelectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newSelectedDate);

        // Update time ranges based on the new date
        if (tutorData) {
            const dateStr = newSelectedDate.toISOString().split('T')[0];
            const timeSlotsForDate = tutorData.timeSlots[dateStr] || [];
            setTimeRanges(timeSlotsForDate);

            await logToServer(`=== DATE SELECTED: ${dateStr} ===`);
            await logToServer(`Time ranges for this date: ${JSON.stringify(timeSlotsForDate)}`);
            await logToServer('==============================');
        }
    };

    // Add new time range
    const addTimeRange = async () => {
        const timeRangeStr = `${newTimeRange.start}-${newTimeRange.end}`;
        const updatedRanges = [...timeRanges, timeRangeStr];
        setTimeRanges(updatedRanges);

        await logToServer(`=== ADD TIME RANGE ===`);
        await logToServer(`New time range: ${timeRangeStr}`);
        await logToServer(`All time ranges: ${JSON.stringify(updatedRanges)}`);
        await logToServer(`=====================`);
    };

    // Remove time range
    const removeTimeRange = async (index: number) => {
        const updatedRanges = timeRanges.filter((_, i) => i !== index);
        setTimeRanges(updatedRanges);

        await logToServer(`=== REMOVE TIME RANGE ===`);
        await logToServer(`Removed index: ${index}`);
        await logToServer(`Remaining ranges: ${JSON.stringify(updatedRanges)}`);
        await logToServer(`========================`);
    };

    // Clear all time ranges for selected date
    const clearAllTimeRanges = async () => {
        setTimeRanges([]);
        await logToServer('=== CLEAR ALL TIME RANGES ===');
        await logToServer('All time ranges cleared for selected date');
        await logToServer('=====================================');

        // Note: The date will be removed from datesAvailable when saved
        // This ensures consistency between timeSlots and datesAvailable
    };

    // Save availability to Firebase
    const saveAvailability = async () => {
        if (!tutorData || !currentUser?.uid) {
            await logToServer('ERROR: Cannot save - missing tutor data or user UID', 'error');
            return;
        }

        try {
            setSaving(true);
            await logToServer('=== SAVING AVAILABILITY ===');
            await logToServer(`Selected date: ${selectedDate.toISOString().split('T')[0]}`);
            await logToServer(`Time ranges to save: ${JSON.stringify(timeRanges)}`);
            await logToServer(`Action: ${timeRanges.length > 0 ? 'Adding/Updating' : 'Clearing'} availability for this date`);

            // Get the selected date string
            const selectedDateStr = selectedDate.toISOString().split('T')[0];

            // Update the tutor document in Firebase
            const tutorDocRef = doc(db, 'tutors', currentUser.uid);

            // Prepare the updated data
            let updatedTimeSlots = { ...tutorData.timeSlots };

            if (timeRanges.length > 0) {
                // Add or update time slots for this date
                updatedTimeSlots[selectedDateStr] = timeRanges;
            } else {
                // Remove the date from timeSlots if no time ranges exist
                delete updatedTimeSlots[selectedDateStr];
            }

            // Update datesAvailable array
            const updatedDatesAvailable = [...tutorData.datesAvailable];

            if (timeRanges.length > 0) {
                // Add date if it has time ranges and isn't already included
                if (!updatedDatesAvailable.includes(selectedDateStr)) {
                    updatedDatesAvailable.push(selectedDateStr);
                }
            } else {
                // Remove date if it has no time ranges
                const dateIndex = updatedDatesAvailable.indexOf(selectedDateStr);
                if (dateIndex > -1) {
                    updatedDatesAvailable.splice(dateIndex, 1);
                }
            }

            // Update the document
            await updateDoc(tutorDocRef, {
                timeSlots: updatedTimeSlots,
                datesAvailable: updatedDatesAvailable
            });

            // Update local state
            setTutorData({
                ...tutorData,
                timeSlots: updatedTimeSlots,
                datesAvailable: updatedDatesAvailable
            });

            await logToServer('=== AVAILABILITY SAVED SUCCESSFULLY ===');
            await logToServer(`Updated timeSlots: ${JSON.stringify(updatedTimeSlots)}`);
            await logToServer(`Updated datesAvailable: ${JSON.stringify(updatedDatesAvailable)}`);
            await logToServer('==========================================');

            // Show success message
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3 seconds

        } catch (error) {
            await logToServer(`ERROR saving availability: ${error}`, 'error');
            console.error('Error saving availability:', error);
        } finally {
            setSaving(false);
        }
    };

    // Generate calendar days for current month
    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        while (currentDate <= lastDay || days.length < 42) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const getSelectedCount = () => timeRanges.length;

    const availableDates = parseAvailableDates();

    if (loading) {
        return (
            <div className="bg-[#fbf8f6] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#96aa97] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading availability data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fbf8f6] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Professional Header */}
                <header className="w-full h-36 bg-[#6e7d6f] px-[74px] flex items-center">
                    <h1 className="font-bold text-[#fbf8f6] text-4xl tracking-tight">
                        Manage Your Availability
                    </h1>
                </header>

                {/* Main Content */}
                <main className="px-8 py-12">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Calendar Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#2f2f2f]">Select Available Dates</h2>
                                        <p className="text-gray-600 text-sm">Choose when you're available for tutoring sessions</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md">
                                    {/* Month Navigation */}
                                    <div className="flex items-center justify-between px-4 py-4 mb-4">
                                        <button
                                            onClick={goToPreviousMonth}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="text-xl font-semibold text-[#2f2f2f]">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button
                                            onClick={goToNextMonth}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="mx-4 border-t border-gray-200 mb-4"></div>

                                    {/* Calendar Grid */}
                                    <div className="px-4">
                                        {/* Day Headers */}
                                        <div className="grid grid-cols-7 gap-1 mb-3">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                                <div key={index} className="text-center py-2">
                                                    <span className="text-xs font-medium uppercase tracking-tight text-gray-500">
                                                        {day}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Date Grid */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {getCalendarDays().map((date, index) => {
                                                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                                const dateStr = date.toISOString().split('T')[0];
                                                const isAvailable = availableDates.some((availDate: any) => availDate.fullDate === dateStr);

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDateSelect(date.getDate())}
                                                        className={`
                                                            h-10 flex items-center justify-center rounded-lg text-sm font-medium
                                                            transition-all duration-200 relative
                                                            ${!isCurrentMonth
                                                                ? 'text-gray-300'
                                                                : isSelected
                                                                    ? 'bg-[#96aa97] text-white shadow-md'
                                                                    : isAvailable
                                                                        ? 'bg-[#e8f5e8] text-[#2f2f2f] border-2 border-[#96aa97]'
                                                                        : 'text-[#2f2f2f] hover:bg-[#f0f4f0] hover:border-2 hover:border-[#96aa97]'
                                                            }
                                                        `}
                                                    >
                                                        {date.getDate()}
                                                        {isAvailable && isCurrentMonth && (
                                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#96aa97] rounded-full"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Time Ranges Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#f8faf8] to-[#f0f4f0] px-8 py-6 border-b border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-[#96aa97] rounded-xl flex items-center justify-center shadow-sm">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#2f2f2f]">Set Available Time Ranges</h2>
                                        <p className="text-gray-600 text-sm">Add time ranges for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Time Ranges Management */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#2f2f2f] mb-6">Time Ranges for Selected Date</h3>

                                        {/* Add New Time Range */}
                                        <div className="bg-[#f8faf8] rounded-xl p-4 border border-gray-200 mb-6">
                                            <h4 className="font-medium text-[#2f2f2f] mb-3">Add New Time Range</h4>
                                            <div className="flex space-x-3 mb-3">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                                    <select
                                                        value={newTimeRange.start}
                                                        onChange={(e) => setNewTimeRange(prev => ({ ...prev, start: e.target.value }))}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#96aa97] focus:border-[#96aa97]"
                                                    >
                                                        {timeOptions.map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                                    <select
                                                        value={newTimeRange.end}
                                                        onChange={(e) => setNewTimeRange(prev => ({ ...prev, end: e.target.value }))}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#96aa97] focus:border-[#96aa97]"
                                                    >
                                                        {timeOptions.map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={addTimeRange}
                                                className="w-full px-4 py-2 bg-[#96aa97] text-white font-medium rounded-lg hover:bg-[#86998a] transition-colors"
                                            >
                                                Add Time Range
                                            </button>
                                        </div>

                                        {/* Current Time Ranges */}
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                                            {timeRanges.length > 0 ? (
                                                timeRanges.map((range, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-16 bg-white shadow-sm border-2 border-gray-200 rounded-xl flex items-center justify-between px-5 hover:shadow-md transition-all duration-200 hover:border-[#96aa97]"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <Clock className="w-5 h-5 text-[#96aa97]" />
                                                            <span className="text-base font-medium text-[#2f2f2f]">
                                                                {range}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeTimeRange(index)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                    <p>No time ranges set for this date</p>
                                                    <p className="text-sm">Add time ranges using the form above</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Summary and Actions */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#2f2f2f] mb-6">Summary</h3>

                                        {/* Time Ranges Count */}
                                        <div className="bg-[#f0f4f0] rounded-xl p-6 border border-[#96aa97] mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <CheckCircle className="w-6 h-6 text-[#96aa97]" />
                                                    <span className="text-lg font-semibold text-[#2f2f2f]">
                                                        {getSelectedCount()} time range{getSelectedCount() !== 1 ? 's' : ''} set
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                You have {getSelectedCount()} time range{getSelectedCount() !== 1 ? 's' : ''} configured for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>

                                        {/* Database Info */}
                                        {availableDates.length > 0 && (
                                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                                                <h4 className="font-medium text-blue-800 mb-2">Database Status</h4>
                                                <p className="text-blue-700 text-sm">
                                                    You have {availableDates.length} date{availableDates.length !== 1 ? 's' : ''} marked as available in your profile
                                                </p>
                                            </div>
                                        )}

                                        {/* Success Message */}
                                        {saveSuccess && (
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                    <span className="text-green-800 font-medium">
                                                        Availability saved successfully!
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Info Message */}
                                        {timeRanges.length === 0 && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <span className="text-blue-800 text-sm">
                                                        No time ranges set for this date. Click "Save Availability" to clear this date from your availability.
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Quick Actions */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={clearAllTimeRanges}
                                                className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Clear All Time Ranges</span>
                                            </button>

                                            <button
                                                onClick={saveAvailability}
                                                disabled={saving}
                                                className={`w-full px-6 py-3 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${saving
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-[#96aa97] to-[#86998a] hover:shadow-xl transform hover:-translate-y-0.5'
                                                    }`}
                                            >
                                                {saving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Saving...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Settings className="w-4 h-4" />
                                                        <span>Save Availability</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #96aa97;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #86998a;
                }
            `}</style>
        </div>
    );
};