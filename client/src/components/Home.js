// import styled from "styled-components";
// import styled from "styled-components";
import React from "react";
import { HomeNavbar } from "./index";

function Home() {
  return (
    <>
      <HomeNavbar></HomeNavbar>
      <div className="body_center">
        <div style={{ fontSize: "4rem", color: "#514F4F" }}>
          Welcome to Tic Tac Game
        </div>
      </div>
    </>
  );
}

export default Home;

