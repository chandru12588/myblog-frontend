import { createContext, useState, useEffect } from "react";
import { auth } from "../config/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevents UI flicker during session check

  useEffect(() => {
    // Track login state in real-time
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // clean up
  }, []);

  // Logout user
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user"); // optional but useful if you store user
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center text-xl font-semibold">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
