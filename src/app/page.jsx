"use client";

// import AuthTokenProvider from "./context";
// import { useContext } from "react";
import { AuthContext } from "./context";

export default function Home() {
  const { authToken,login , logout} = AuthContext;
  console.log(login, "is the value of the login")
  return (
    <div className="">
      Home page
    </div>
  );
}
