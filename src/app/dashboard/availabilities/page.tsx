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

// Debug flag - set to true to enable detailed logging
const DEBUG_MODE = false;

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
    const [timeRanges, setTimeRanges] = useState<string[]>([]);
    const [newTimeRange, setNewTimeRange] = useState({ start: '09:00', end: '10:00' });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    // Show toast notification
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000); // Auto-hide after 4 seconds
    };

    // Generate time options for the dropdowns
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 6; hour <= 22; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            options.push(time);
        }
        return options;
    };

    // Helper function to convert 24-hour format to AM/PM format
    const formatTimeToAMPM = (timeStr: string): string => {
        if (!timeStr || !timeStr.includes(':')) return timeStr;

        const [hours, minutes] = timeStr.split(':').map(Number);
        const hour = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    // Helper function to format time range display (e.g., "09:00-10:00" to "9:00 AM - 10:00 AM")
    const formatTimeRangeDisplay = (timeRange: string): string => {
        if (!timeRange || !timeRange.includes('-')) return timeRange;

        const [start, end] = timeRange.split('-');
        return `${formatTimeToAMPM(start)} - ${formatTimeToAMPM(end)}`;
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
                if (DEBUG_MODE) {
                    await logToServer('=== FIREBASE TUTOR DATA ===');
                    await logToServer(`Tutor UID: ${tutorData.uid}`);
                    await logToServer(`Tutor Name: ${tutorData.name}`);
                    await logToServer(`Tutor Email: ${tutorData.email}`);
                    await logToServer(`Available Dates: ${JSON.stringify(tutorData.datesAvailable)}`);
                    await logToServer(`Time Slots: ${JSON.stringify(tutorData.timeSlots)}`);
                    await logToServer(`Subjects: ${JSON.stringify(tutorData.subjects)}`);
                    await logToServer('==========================');
                }

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

        // Validate and clean time slots from database
        const validatedTimeSlots = await validateAndCleanTimeSlots(timeSlotsForDate);
        setTimeRanges(validatedTimeSlots);

        if (DEBUG_MODE) {
            await logToServer(`=== TIME RANGES FOR ${selectedDateStr} ===`);
            await logToServer(`Time ranges from Firebase: ${JSON.stringify(timeSlotsForDate)}`);
            await logToServer(`Validated time ranges: ${JSON.stringify(validatedTimeSlots)}`);
            await logToServer('==============================');
        }
    };

    // Validate and clean time slots from database
    const validateAndCleanTimeSlots = async (timeSlots: string[]): Promise<string[]> => {
        const validSlots: string[] = [];
        const seenSlots = new Set<string>();

        for (const slot of timeSlots) {
            // Check if slot format is valid (should be "HH:MM-HH:MM")
            if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot)) {
                if (DEBUG_MODE) {
                    await logToServer(`Invalid time slot format: ${slot}`, 'warn');
                }
                continue;
            }

            const [start, end] = slot.split('-');

            // Basic validation
            const validation = validateTimeSlot(start, end);
            if (!validation.isValid) {
                if (DEBUG_MODE) {
                    await logToServer(`Invalid time slot from database: ${slot} - ${validation.errorMessage}`, 'warn');
                }
                continue;
            }

            // Check for duplicates within the loaded data
            if (seenSlots.has(slot)) {
                if (DEBUG_MODE) {
                    await logToServer(`Duplicate time slot found in database: ${slot}`, 'warn');
                }
                continue;
            }

            validSlots.push(slot);
            seenSlots.add(slot);
        }

        return validSlots;
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

            if (DEBUG_MODE) {
                await logToServer(`=== DATE SELECTED: ${dateStr} ===`);
                await logToServer(`Time ranges for this date: ${JSON.stringify(timeSlotsForDate)}`);
                await logToServer('==============================');
            }
        }
    };

    // Validation function to check for duplicates and other validation rules
    const validateTimeSlot = (startTime: string, endTime: string): { isValid: boolean; errorMessage: string } => {
        // Check if start time is before end time
        if (startTime >= endTime) {
            return {
                isValid: false,
                errorMessage: "Start time must be before end time"
            };
        }

        // Check for minimum time slot duration (e.g., 30 minutes)
        const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
        const durationMinutes = endMinutes - startMinutes;

        if (durationMinutes < 30) {
            return {
                isValid: false,
                errorMessage: "Time slot must be at least 30 minutes long"
            };
        }

        // Check for exact duplicates only (allow overlaps)
        const newTimeRangeStr = `${startTime}-${endTime}`;

        if (timeRanges.includes(newTimeRangeStr)) {
            return {
                isValid: false,
                errorMessage: "This exact time slot already exists"
            };
        }

        // Check for time boundaries (e.g., not too early or too late)
        if (startMinutes < 360) { // Before 6:00 AM
            return {
                isValid: false,
                errorMessage: "Start time cannot be before 6:00 AM"
            };
        }

        if (endMinutes > 1320) { // After 10:00 PM
            return {
                isValid: false,
                errorMessage: "End time cannot be after 10:00 PM"
            };
        }

        return {
            isValid: true,
            errorMessage: ""
        };
    };

    /**
     * Merges overlapping or adjacent time slots
     * @param {string[]} timeSlots - Array of time slots in "HH:MM-HH:MM" format
     * @returns {string[]} - Array of merged time slots
     */
    const mergeTimeSlots = (timeSlots: string[]): string[] => {
        // Handle edge cases
        if (!timeSlots || timeSlots.length === 0) {
            return [];
        }

        if (timeSlots.length === 1) {
            return [...timeSlots];
        }

        // Helper function to convert "HH:MM" to minutes since midnight
        const timeToMinutes = (timeStr: string): number => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        // Helper function to convert minutes back to "HH:MM" format
        const minutesToTime = (minutes: number): string => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        };

        // Parse time slots into objects with start and end in minutes
        const intervals = timeSlots
            .map(slot => {
                const [start, end] = slot.split('-');
                return {
                    start: timeToMinutes(start),
                    end: timeToMinutes(end)
                };
            })
            .filter(interval => !isNaN(interval.start) && !isNaN(interval.end)); // Filter out invalid slots

        // Sort intervals by start time
        intervals.sort((a, b) => a.start - b.start);

        // Merge overlapping or adjacent intervals
        const merged: { start: number; end: number }[] = [];
        let current = { ...intervals[0] };

        for (let i = 1; i < intervals.length; i++) {
            const next = intervals[i];

            // Check if intervals overlap or are adjacent
            if (current.end >= next.start) {
                // Merge by extending the end time if necessary
                current.end = Math.max(current.end, next.end);
            } else {
                // No overlap, save current and start new interval
                merged.push(current);
                current = { ...next };
            }
        }

        // Don't forget to add the last interval
        merged.push(current);

        // Convert back to string format
        return merged.map(interval =>
            `${minutesToTime(interval.start)}-${minutesToTime(interval.end)}`
        );
    };

    // Function to automatically merge overlapping time slots
    const autoMergeTimeSlots = async () => {
        if (timeRanges.length <= 1) {
            if (DEBUG_MODE) {
                await logToServer('No overlapping slots to merge');
            }
            return;
        }

        const originalSlots = [...timeRanges];
        const mergedSlots = mergeTimeSlots(timeRanges);

        if (mergedSlots.length < originalSlots.length) {
            setTimeRanges(mergedSlots);

            if (DEBUG_MODE) {
                await logToServer(`=== AUTO-MERGED TIME SLOTS ===`);
                await logToServer(`Original slots: ${JSON.stringify(originalSlots)}`);
                await logToServer(`Merged slots: ${JSON.stringify(mergedSlots)}`);
                await logToServer(`Reduced from ${originalSlots.length} to ${mergedSlots.length} slots`);
                await logToServer(`=====================================`);
            }
        } else {
            if (DEBUG_MODE) {
                await logToServer('No overlapping slots found to merge');
            }
        }
    };

    // Function to check if there are overlapping time slots
    const hasOverlappingSlots = (): boolean => {
        if (timeRanges.length <= 1) return false;

        const mergedSlots = mergeTimeSlots(timeRanges);
        return mergedSlots.length < timeRanges.length;
    };

    // Function to get merge suggestions
    const getMergeSuggestions = (): string[] => {
        if (timeRanges.length <= 1) return [];

        const mergedSlots = mergeTimeSlots(timeRanges);
        if (mergedSlots.length >= timeRanges.length) return [];

        return mergedSlots;
    };

    // Computed merged time slots for display
    const mergedTimeSlots = timeRanges.length > 1 ? mergeTimeSlots(timeRanges) : timeRanges;
    const hasOverlaps = timeRanges.length > 1 && mergedTimeSlots.length < timeRanges.length;

    // Add new time range with validation
    const addTimeRange = async () => {
        // Validate the new time slot
        const validation = validateTimeSlot(newTimeRange.start, newTimeRange.end);

        if (!validation.isValid) {
            // Show error message using toast
            if (DEBUG_MODE) {
                await logToServer(`=== VALIDATION ERROR ===`);
                await logToServer(`Error: ${validation.errorMessage}`);
                await logToServer(`Start: ${newTimeRange.start}, End: ${newTimeRange.end}`);
                await logToServer(`=====================`);
            }

            // Show toast notification instead of alert
            showToast(validation.errorMessage, 'error');
            return;
        }

        const timeRangeStr = `${newTimeRange.start}-${newTimeRange.end}`;
        const updatedRanges = [...timeRanges, timeRangeStr];
        setTimeRanges(updatedRanges);

        // Reset the form
        setNewTimeRange({ start: '09:00', end: '10:00' });

        if (DEBUG_MODE) {
            await logToServer(`=== ADD TIME RANGE ===`);
            await logToServer(`New time range: ${timeRangeStr}`);
            await logToServer(`All time ranges: ${JSON.stringify(updatedRanges)}`);
            await logToServer(`=====================`);
        }
    };

    // Remove time range
    const removeTimeRange = async (index: number) => {
        const updatedRanges = timeRanges.filter((_, i) => i !== index);
        setTimeRanges(updatedRanges);

        if (DEBUG_MODE) {
            await logToServer(`=== REMOVE TIME RANGE ===`);
            await logToServer(`Removed index: ${index}`);
            await logToServer(`Remaining ranges: ${JSON.stringify(updatedRanges)}`);
            await logToServer(`========================`);
        }
    };

    // Clear all time ranges for selected date
    const clearAllTimeRanges = async () => {
        setTimeRanges([]);
        if (DEBUG_MODE) {
            await logToServer('=== CLEAR ALL TIME RANGES ===');
            await logToServer('All time ranges cleared for selected date');
            await logToServer('=====================================');
        }

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
            if (DEBUG_MODE) {
                await logToServer('=== SAVING AVAILABILITY ===');
                await logToServer(`Selected date: ${selectedDate.toISOString().split('T')[0]}`);
                await logToServer(`Time ranges to save: ${JSON.stringify(timeRanges)}`);
                await logToServer(`Action: ${timeRanges.length > 0 ? 'Adding/Updating' : 'Clearing'} availability for this date`);
            }

            // Auto-merge overlapping time slots before saving
            let finalTimeRanges = [...timeRanges];
            if (timeRanges.length > 1) {
                const mergedSlots = mergeTimeSlots(timeRanges);
                if (mergedSlots.length < timeRanges.length) {
                    finalTimeRanges = mergedSlots;
                    if (DEBUG_MODE) {
                        await logToServer(`=== AUTO-MERGED BEFORE SAVE ===`);
                        await logToServer(`Original slots: ${JSON.stringify(timeRanges)}`);
                        await logToServer(`Merged slots: ${JSON.stringify(mergedSlots)}`);
                        await logToServer(`Reduced from ${timeRanges.length} to ${mergedSlots.length} slots`);
                        await logToServer(`=====================================`);
                    }
                }
            }

            // Get the selected date string
            const selectedDateStr = selectedDate.toISOString().split('T')[0];

            // Update the tutor document in Firebase
            const tutorDocRef = doc(db, 'tutors', currentUser.uid);

            // Prepare the updated data
            let updatedTimeSlots = { ...tutorData.timeSlots };

            if (finalTimeRanges.length > 0) {
                // Add or update time slots for this date
                updatedTimeSlots[selectedDateStr] = finalTimeRanges;
            } else {
                // Remove the date from timeSlots if no time ranges exist
                delete updatedTimeSlots[selectedDateStr];
            }

            // Update datesAvailable array
            const updatedDatesAvailable = [...tutorData.datesAvailable];

            if (finalTimeRanges.length > 0) {
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

            // Update local state with merged slots
            setTimeRanges(finalTimeRanges);
            setTutorData({
                ...tutorData,
                timeSlots: updatedTimeSlots,
                datesAvailable: updatedDatesAvailable
            });

            if (DEBUG_MODE) {
                await logToServer('=== AVAILABILITY SAVED SUCCESSFULLY ===');
                await logToServer(`Updated timeSlots: ${JSON.stringify(updatedTimeSlots)}`);
                await logToServer(`Updated datesAvailable: ${JSON.stringify(updatedDatesAvailable)}`);
                await logToServer('==========================================');
            }

            // Show success message using toast
            const successMessage = timeRanges.length > 0 && hasOverlaps
                ? 'Availability saved successfully! Overlapping time slots were automatically merged.'
                : 'Availability saved successfully!';
            showToast(successMessage, 'success');

        } catch (error) {
            if (DEBUG_MODE) {
                await logToServer(`ERROR saving availability: ${error}`, 'error');
            }
            console.error('Error saving availability:', error);
            showToast('Error saving availability. Please try again.', 'error');
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
                {/* Compact Header */}
                <header className="w-full bg-[#6e7d6f] px-8 py-6">
                    <h1 className="font-bold text-[#fbf8f6] text-3xl tracking-tight">
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
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-[#2f2f2f]">Select Available Dates</h2>
                                        <p className="text-gray-600 text-sm">Choose when you're available for tutoring sessions</p>
                                    </div>

                                    {/* Month Navigation */}
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={goToPreviousMonth}
                                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-[#2f2f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="text-lg font-semibold text-[#2f2f2f] min-w-[100px] text-center">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button
                                            onClick={goToNextMonth}
                                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-[#2f2f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="max-w-3xl mx-auto">
                                    {/* Calendar Grid */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        {/* Day Headers */}
                                        <div className="grid grid-cols-7 gap-1 mb-4">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                                <div key={index} className="text-center py-2">
                                                    <span className="text-sm font-medium uppercase tracking-tight text-gray-800">
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
                                                            h-12 flex items-center justify-center rounded-lg text-sm font-medium
                                                            transition-all duration-200 relative
                                                            ${!isCurrentMonth
                                                                ? 'text-gray-300'
                                                                : isSelected
                                                                    ? 'bg-[#96aa97] text-white shadow-md'
                                                                    : isAvailable
                                                                        ? 'bg-[#e8f5e8] text-gray-900 border-2 border-[#96aa97]'
                                                                        : 'text-gray-900 hover:bg-[#f0f4f0] hover:border-2 hover:border-[#96aa97]'
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
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Time Ranges for Selected Date</h3>

                                        {/* Add New Time Range */}
                                        <div className="bg-[#f8faf8] rounded-xl p-4 border border-gray-200 mb-6">
                                            <h4 className="font-medium text-gray-900 mb-3">Add New Time Range</h4>
                                            <div className="flex space-x-3 mb-3">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                                    <select
                                                        value={newTimeRange.start}
                                                        onChange={(e) => setNewTimeRange(prev => ({ ...prev, start: e.target.value }))}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#96aa97] focus:border-[#96aa97] bg-white text-gray-900"
                                                    >
                                                        {timeOptions.map(time => (
                                                            <option key={time} value={time} className="text-gray-900 bg-white">
                                                                {formatTimeToAMPM(time)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                                    <select
                                                        value={newTimeRange.end}
                                                        onChange={(e) => setNewTimeRange(prev => ({ ...prev, end: e.target.value }))}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#96aa97] focus:border-[#96aa97] bg-white text-gray-900"
                                                    >
                                                        {timeOptions.map(time => (
                                                            <option key={time} value={time} className="text-gray-900 bg-white">
                                                                {formatTimeToAMPM(time)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {/* Display selected time range in AM/PM format */}
                                            <div className="text-center mb-3">
                                                <span className="text-sm text-gray-600">
                                                    Selected: {formatTimeToAMPM(newTimeRange.start)} - {formatTimeToAMPM(newTimeRange.end)}
                                                </span>
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
                                            {/* Overlapping Slots Warning */}
                                            {hasOverlaps && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                        <span className="text-yellow-800 font-medium">Overlapping Time Slots Detected</span>
                                                    </div>
                                                    <p className="text-yellow-700 text-sm">
                                                        You have overlapping or adjacent time slots. These will be automatically merged when you save your availability.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Original Input Slots */}
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Input Time Slots:</h4>
                                                {timeRanges.length > 0 ? (
                                                    timeRanges.map((range, index) => (
                                                        <div
                                                            key={index}
                                                            className="h-12 bg-gray-50 shadow-sm border border-gray-200 rounded-lg flex items-center justify-between px-4 mb-2 hover:shadow-md transition-all duration-200"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Clock className="w-4 h-4 text-gray-500" />
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {formatTimeRangeDisplay(range)}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => removeTimeRange(index)}
                                                                className="p-1 hover:bg-red-50 rounded transition-colors text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-4 text-gray-500">
                                                        <p className="text-sm">No time ranges set for this date</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Merged Display Slots */}
                                            {hasOverlaps && (
                                                <div className="border-t pt-4">
                                                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Merged Display (what will be saved):</span>
                                                    </h4>
                                                    {mergedTimeSlots.map((range, index) => (
                                                        <div
                                                            key={index}
                                                            className="h-12 bg-green-50 shadow-sm border-2 border-green-200 rounded-lg flex items-center justify-center px-4 mb-2"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Clock className="w-4 h-4 text-green-600" />
                                                                <span className="text-sm font-medium text-green-800">
                                                                    {formatTimeRangeDisplay(range)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Summary and Actions */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Summary</h3>

                                        {/* Time Ranges Count */}
                                        <div className="bg-[#f0f4f0] rounded-xl p-6 border border-[#96aa97] mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <CheckCircle className="w-6 h-6 text-[#96aa97]" />
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        {timeRanges.length} time range{timeRanges.length !== 1 ? 's' : ''} set
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm mb-2">
                                                You have {timeRanges.length} time range{timeRanges.length !== 1 ? 's' : ''} configured for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            {hasOverlaps && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                                                    <p className="text-green-800 text-sm font-medium">
                                                        When saved, these will be merged into {mergedTimeSlots.length} efficient time slot{mergedTimeSlots.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Database Info */}
                                        {availableDates.length > 0 && (
                                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                                                <h4 className="font-medium text-blue-800 mb-2">Status</h4>
                                                <p className="text-blue-700 text-sm">
                                                    You have {availableDates.length} date{availableDates.length !== 1 ? 's' : ''} marked as available in your profile
                                                </p>
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