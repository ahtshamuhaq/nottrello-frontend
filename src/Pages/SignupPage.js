import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { dataBase } from "../firebase/FirebaseCofig";
import { createUserWithEmailAndPassword } from "firebase/auth";
const SignupPage = () => {
  const history = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    createUserWithEmailAndPassword(dataBase, email, password).then((data) => {
      console.log(data, "authData");
      history("/login");
    });
  };

  return (
    <div>
      <div className=" text-gray-700">
        <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
          <h1 className="text-2xl text-center underline text-blue-600 ">
            NOTTRELLO
          </h1>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700">
              Kindly Register yourself
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between  ">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="block rounded-md pl-2 border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  for="lastname"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    autocomplete="lastname"
                    required
                    className="block   rounded-md pl-2 border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                for="email"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  className="block w-full rounded-md pl-2 border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  className="block w-full rounded-md border-0 pl-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex ml-10 mt-4 sm:mt-4 sm:ml-0  w-1/2  sm:w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?
              <Link to={"/login"}>
                <p className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Log In
                </p>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
