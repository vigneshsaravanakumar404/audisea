import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export async function setStudentData(uid: string, data: any) {
  const userRef = doc(db, "students", uid);
  await setDoc(userRef, data);
}