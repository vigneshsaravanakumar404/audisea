import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import {
    TutorSchema,
    ParentSchema,
    StudentSchema,
    SessionSchema,
    createDefaultTutorDocument,
    createDefaultParentDocument,
    createDefaultStudentDocument,
    TUTOR_COLLECTION_NAME,
    PARENT_COLLECTION_NAME,
    STUDENT_COLLECTION_NAME,
    SESSION_COLLECTION_NAME
} from '@/data/schemas';

export class FirebaseUtils {
    /**
     * Get or create a tutor document
     */
    static async getOrCreateTutor(uid: string, name: string, email: string, photoURL: string): Promise<TutorSchema> {
        const tutorDocRef = doc(db, TUTOR_COLLECTION_NAME, uid);
        const tutorDoc = await getDoc(tutorDocRef);

        if (tutorDoc.exists()) {
            return tutorDoc.data() as TutorSchema;
        } else {
            const defaultTutorData = createDefaultTutorDocument(uid, name, email, photoURL);
            await setDoc(tutorDocRef, defaultTutorData);
            return defaultTutorData;
        }
    }

    /**
     * Get or create a parent document
     */
    static async getOrCreateParent(uid: string, name: string, email: string, photoURL: string): Promise<ParentSchema> {
        const parentDocRef = doc(db, PARENT_COLLECTION_NAME, uid);
        const parentDoc = await getDoc(parentDocRef);

        if (parentDoc.exists()) {
            return parentDoc.data() as ParentSchema;
        } else {
            const defaultParentData = createDefaultParentDocument(uid, name, email, photoURL);
            await setDoc(parentDocRef, defaultParentData);
            return defaultParentData;
        }
    }

    /**
     * Get or create a student document
     */
    static async getOrCreateStudent(uid: string, name: string, email: string, photoURL: string, parentUid: string): Promise<StudentSchema> {
        const studentDocRef = doc(db, STUDENT_COLLECTION_NAME, uid);
        const studentDoc = await getDoc(studentDocRef);

        if (studentDoc.exists()) {
            return studentDoc.data() as StudentSchema;
        } else {
            const defaultStudentData = createDefaultStudentDocument(uid, name, email, photoURL, parentUid);
            await setDoc(studentDocRef, defaultStudentData);
            return defaultStudentData;
        }
    }

    /**
     * Check if a document exists in a collection
     */
    static async documentExists(collectionName: string, documentId: string): Promise<boolean> {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    /**
     * Get a document from any collection
     */
    static async getDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
        try {
            const docRef = doc(db, collectionName, documentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as T;
            }
            return null;
        } catch (error) {
            console.error(`Error getting document from ${collectionName}:`, error);
            return null;
        }
    }
}
