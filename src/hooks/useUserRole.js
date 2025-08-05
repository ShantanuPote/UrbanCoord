import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useUserRole() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Current Firebase user:", auth.currentUser);
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    fetchUserData();
  }, []);

  return user; // either null or { role, department, ... }
}
