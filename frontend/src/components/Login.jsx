import React, { useState } from "react";
import logImg from "../assets/LogIn.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OAuth from "./OAuth";
import Register from "./Register";

const Login = () => {
  //show and hide password
  const [visibility, setVisibility] = useState(false);

  //toggle login / register
  const [showRegister, setShowRegister] = useState(false);

  const handleClickRegister = () => {
    setShowRegister(true);
  };
  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  return (
    <div>
      {showRegister && <Register />}
      {!showRegister && (
        <div className="flex flex-row">
          {/* First column  / disapeared on mobile */}
          <div className="w-2/3 bg-gray-100 hidden lg:flex h-screen flex-col items-center ">
            <div className="w-full text-center m-14 text-4xl font-normal font-goretzk">
              <p className="inline-block">Welcome to</p>{" "}
              <strong>
                <span>Jo</span>
                <span className="text-[#6610F2]">B</span>
                <span>old</span>
                <span className="text-[#6610F2]">.</span>
              </strong>
            </div>
            <img
              src={logImg}
              alt="presentation"
              className="w-2/4 rounded-full mx-20"
            />
            <div className="m-14">
              <p className="font-goretzk text-4xl">
                Where finding the perfect <br /> Talent is made{" "}
                <p className="font-bold font-goretzk inline">easy </p>{" "}
                <p className="inline">&</p>
                <p className="font-bold font-goretzk inline"> fun</p>
                <p className="inline">!</p>
              </p>
            </div>
          </div>

          {/* Second column */}
          <div className="lg:w-1/3 bg-white flex w-full items-center justify-center">
            <form className="w-4/5">
              <div className="mb-4">
                <div className="flex flex-row">
                  <button
                    disabled
                    className="w-1/2 h-7.5 font-poppins w-34 py-4 text-base font-semibold text-black border-b-black border-b"
                  >
                    LogIn
                  </button>
                  <button
                    onClick={handleClickRegister}
                    className="w-1/2 h-7.5 font-poppins w-34 py-4 text-base font-semibold text-black"
                  >
                    Register
                  </button>
                </div>
                <hr></hr>
                <br />
                <br />
              </div>
              <form >
                <input
                  className="placeholder-poppins placeholder:text-black/[.5] placeholder:text-[14px] placeholder:font-normal w-full h-12 border-b-[.5px] border-black/[.5] focus:outline-none text-xl"
                  id="email"
                  type="email"
                  placeholder="Email"
                />
                <div className="mb-6 relative">
                  <input
                    className="placeholder-poppins placeholder:text-black/[.5] placeholder:text-[14px] placeholder:font-normal w-full h-12 border-b-[.5px] border-black/[.5] focus:outline-none text-xl"
                    id="password"
                    type={visibility === false ? "password" : "text"}
                    placeholder="Password"
                  />
                  <div className="text-base cursor-pointer hover:text-black/[.7] absolute top-5 right-3 text-black/[.5]">
                    {visibility === false ? (
                      <AiOutlineEye onClick={toggleVisibility} />
                    ) : (
                      <AiOutlineEyeInvisible onClick={toggleVisibility} />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-14 mb-0.5">
                  <button
                    className="w-full font-montserrat h-10 bg-[#418DFD] text-base hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Log In
                  </button>
                </div>
              </form>
              <div className="text-center">
                <a
                  href="#"
                  className="font-goretzk text-black/[.7] underline font-normal text-xs"
                >
                  Forgot your password?
                </a>
              </div>
              {/* OAuth */}
              <OAuth />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
