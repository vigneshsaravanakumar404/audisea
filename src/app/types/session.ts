import { Student, Tutor } from './user'; 
import { DocumentReference, Timestamp } from "firebase/firestore";


export interface Session{
  uid: string
  date: string
  startTime: string
  endTime: string
  student: string
  tutor: string
  studentRef: DocumentReference
  tutorRef: DocumentReference
  meetURL: string
  subject: string
  description?: string
  confirmed?: boolean
};