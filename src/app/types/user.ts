export interface UserInfo {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  userType: string;
}

export interface Student extends UserInfo {
  uid: string
  tutors: Tutor[]
  parents: Parent[]
}

export interface Tutor extends UserInfo {
  uid: string

}

export interface Parent extends UserInfo {
  uid: string
  
}