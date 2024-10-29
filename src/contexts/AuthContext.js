import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login: async (email, password) => {
      console.log('Attempting login...');
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', result);
        return result;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    signup: async (email, password) => {
      console.log('Attempting signup...');
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Signup successful:', result);
        return result;
      } catch (error) {
        console.error('Signup failed:', error);
        throw error;
      }
    },
    logout: () => signOut(auth)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 