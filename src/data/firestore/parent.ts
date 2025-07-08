import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export async function setParentData(uid: string, data: any) {
  const userRef = doc(db, "parents", uid);
  await setDoc(userRef, data);
  
}