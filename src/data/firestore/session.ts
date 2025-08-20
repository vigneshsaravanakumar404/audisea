import { doc, getDoc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export async function setSessionData(data: any) {
  // create doc with auto-ID
  const docRef = await addDoc(collection(db, "sessions"), data);

  // update with uid field = docRef.id
  await updateDoc(docRef, { uid: docRef.id });

  return docRef.id;
}
export async function getSessionData(uid: string) {
  const userRef = doc(db, "sessions", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
}