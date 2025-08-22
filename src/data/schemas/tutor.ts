export interface TutorSchema {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    userType: 'tutor';
    subjects: string[];
    datesAvailable: string[];
    timeSlots: Record<string, string[]>; // Map of date strings to arrays of time ranges
}

export const createDefaultTutorDocument = (uid: string, name: string, email: string, photoURL: string): TutorSchema => {
    return {
        uid,
        name,
        email,
        photoURL,
        userType: 'tutor',
        subjects: [],
        datesAvailable: [],
        timeSlots: {} // Map of date strings to arrays of time ranges
    };
};

export const TUTOR_COLLECTION_NAME = 'tutors';
