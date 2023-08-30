import React from "react";
import { dataBase } from "../firebase/FirebaseCofig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const userCredential = await signInWithEmailAndPassword(
        dataBase,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        axios
          .post("http://localhost:5000/user/signup", {
            token: token,
            email: email,
          })
          .then((response) => {})
          .catch((error) => {});
      }
      console.log("user is", user);
      console.log("email is ", email);
      if (email === "admin3@gmail.com") {
        history("/admin");
      } else if (email === "admin2@gmail.com") {
        history("/admin");
      } else {
        history("/home");
      }
    } catch (error) {
      alert("Please enter correct credentials");
      console.error("Error signing in:", error);
    }
  };
  return (
    <div>
      <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
        <h1 className="text-2xl text-center underline text-blue-600 ">
          Welcome to NOTTRELLO! Please put your credentials below.
        </h1>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                for="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md pl-2 border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <p className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 pl-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <p className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
