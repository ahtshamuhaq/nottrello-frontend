import { signOut } from "firebase/auth";
import React from "react";
import { dataBase } from "../firebase/FirebaseCofig";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const history = useNavigate();

  const handleClick = () => {
    signOut(dataBase).then((val) => {
      console.log(val, "val");
      history("/");
    });
  };
  return (
    <div>
      <h1>HomePage</h1>
      <button onClick={handleClick}>SignOut</button>
    </div>
  );
};

export default HomePage;
