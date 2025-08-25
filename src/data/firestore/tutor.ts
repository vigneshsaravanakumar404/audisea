import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";


export async function setTutorData(uid: string, data: any) {
  const userRef = doc(db, "tutors", uid);
  await setDoc(userRef, data);
}

export async function getTutorData(uid: string) {
  const userRef = doc(db, "tutors", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
}

export function getTutorDataRef(uid: string) {
  return doc(db, "tutors", uid);
}

export function updateTutorData(uid: string, data: any) {
  const userRef = doc(db, "tutors", uid);
  return setDoc(userRef, data);
}