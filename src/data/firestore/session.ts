import { doc, getDoc, setDoc, addDoc, collection, updateDoc, getDocs } from "firebase/firestore";
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

export async function filterSessionsByDate(date: string) {
  const sessionsRef = collection(db, "sessions");
  const sessionsSnap = await getDocs(sessionsRef);

  const sessions = sessionsSnap.docs.map(doc => ({
    ...doc.data()
  }));

  
  return sessions.filter(session => session.date === date);
}