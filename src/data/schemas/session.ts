export interface SessionSchema {
    uid: string;
    tutorUid: string;
    studentUid: string;
    parentUid: string;
    date: string;
    startTime: string;
    endTime: string;
    subject: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const createDefaultSessionDocument = (
    uid: string,
    tutorUid: string,
    studentUid: string,
    parentUid: string,
    date: string,
    startTime: string,
    endTime: string,
    subject: string
): SessionSchema => {
    const now = new Date().toISOString();
    return {
        uid,
        tutorUid,
        studentUid,
        parentUid,
        date,
        startTime,
        endTime,
        subject,
        status: 'scheduled',
        notes: '',
        createdAt: now,
        updatedAt: now
    };
};

export const SESSION_COLLECTION_NAME = 'sessions';
