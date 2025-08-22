export interface ParentSchema {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    userType: 'parent';
    children: string[]; // Array of student UIDs
    phoneNumber?: string;
}

export const createDefaultParentDocument = (uid: string, name: string, email: string, photoURL: string): ParentSchema => {
    return {
        uid,
        name,
        email,
        photoURL,
        userType: 'parent',
        children: [],
        phoneNumber: ''
    };
};

export const PARENT_COLLECTION_NAME = 'parents';
