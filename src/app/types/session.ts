import { Student, Tutor } from './user'; 

export interface Session{
  uid: string
  date: Date
  studentRef: Student
  tutorRef: Tutor
  meetURL: string
  subject: string
  description?: string
};