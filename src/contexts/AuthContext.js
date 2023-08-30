import React, { createContext, useState, useContext, useEffect } from "react";
import { dataBase, onAuthStateChanged } from "../firebase/FirebaseCofig";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(dataBase, (user) => {
      setCurrentUser(user);
    });
  }, []);

  const contextValue = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
