import { DocumentReference, Timestamp } from "firebase/firestore";

export interface UserInfo {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  userType: string;
}

export interface Student extends UserInfo {
  tutors: DocumentReference[]
  parents: DocumentReference[]
}

export interface Tutor extends UserInfo {
  subjects: string[];
  datesAvailable: string[]
  timeSlots: {
    [dateString: string]: string; // key is formatted date like "2025-08-01"
  };
  

}

export interface Parent extends UserInfo {
  
  
}