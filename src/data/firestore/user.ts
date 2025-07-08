import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";


export async function getUserData(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
}

export async function setUserData(uid: string, data: any) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data);
}
