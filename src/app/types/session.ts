import { Student, Tutor } from './user'; 
import { DocumentReference, Timestamp } from "firebase/firestore";


export interface Session{
  uid: string
  date: Date
  startTime: string
  endTime: string
  studentRef: DocumentReference
  tutorRef: DocumentReference
  meetURL: string
  subject: string
  description?: string
};