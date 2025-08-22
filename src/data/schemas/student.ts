export interface StudentSchema {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    userType: 'student';
    parentUid: string;
    subjects: string[];
    grade: string;
    age: number;
}

export const createDefaultStudentDocument = (uid: string, name: string, email: string, photoURL: string, parentUid: string): StudentSchema => {
    return {
        uid,
        name,
        email,
        photoURL,
        userType: 'student',
        parentUid,
        subjects: [],
        grade: '',
        age: 0
    };
};

export const STUDENT_COLLECTION_NAME = 'students';
