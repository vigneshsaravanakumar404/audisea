import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { DocumentReference } from "firebase/firestore";
import { Tutor } from "@/app/types/user";

export async function setStudentData(uid: string, data: any) {
  const userRef = doc(db, "students", uid);
  await setDoc(userRef, data);
}

export async function getStudentData(uid: string) {
  const userRef = doc(db, "students", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
}
export function getStudentDataRef(uid: string) {
  return doc(db, "students", uid);
}

export async function getStudentTutors(uid: string) {
  const userRef = doc(db, "students", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return [];
  }

  const tutorRefs = userSnap.data()?.tutors as DocumentReference[] || [];


  const fetchedTutors = await Promise.all(
    tutorRefs.map((ref) => getDoc(ref))
  );

  const tutors = fetchedTutors
    .filter(docSnap => docSnap.exists())
    .map(docSnap => {
      return { ...docSnap.data() as Tutor };
    });

  return tutors;
}


export async function getStudentPastDates(uid: string): Promise<string[]> {
  const userRef = doc(db, "students", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return [];
  }

  const pastDates = (userSnap.data()?.pastClassDates ?? []) as string[];
  return pastDates;
}

export async function getStudentUpcomingDates(uid: string): Promise<string[]> {
  const userRef = doc(db, "students", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return [];
  }

  const upcomingDates = (userSnap.data()?.upcomingClassDates ?? []) as string[];
  return upcomingDates;
}


export async function addStudentUpcomingDates(uid: string, date: string) {
  const userRef = doc(db, "students", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return [];
  }

  await updateDoc(userRef, {
    upcomingClassDates: arrayUnion(date),
  });
}

export async function addStudentPastDates(uid: string, date: string) {
  const userRef = doc(db, "students", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return [];
  }

  await updateDoc(userRef, {
    pastClassDates: arrayUnion(date),
  });
}



