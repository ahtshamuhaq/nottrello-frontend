import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSz9zRj88ODEQ2jhCywogOKSDoa8n3u5s",
  authDomain: "emailpasswordlogin-d7540.firebaseapp.com",
  projectId: "emailpasswordlogin-d7540",
  storageBucket: "emailpasswordlogin-d7540.appspot.com",
  messagingSenderId: "837160712411",
  appId: "1:837160712411:web:68d5cc72125745cf6fb4fe",
};

const app = initializeApp(firebaseConfig);
export const dataBase = getAuth(app);
