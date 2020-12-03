// import styled from "styled-components";
import React from "react";
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { v1 as uuid } from "uuid";

function HomeNavbar() {

  let history = useHistory();

  const create=()=> {
    const id = uuid();
    history.push(`/room/${id}`);
  }

  const createBoard=()=> {
    const id = uuid();
    history.push(`/board-room/${id}`);
  }



  return (
    <div style={{ display: "flex", background: "#20232a", padding: "15px" }}>
      <div style={{ margin: "auto auto auto 10px" }}>
        <a href="/" style={{ color: "white", textDecoration: "none" }}>
          HOME
        </a>
      </div>
      <div style={{ margin: "auto 10px auto auto" }}>
      <Button
          style={{marginLeft:'5px'}}
          variant="contained" 
          color="primary"
          onClick={() => {
            history.push("/board");
          }}
        >
          Click to Play
      </Button>
      <Button
          style={{marginLeft:'5px'}}
          variant="contained" 
          color="primary"
          onClick={() => {
            history.push("/join-room");
          }}
        >
          Join Room
      </Button>
      <Button
          style={{marginLeft:'5px'}}
          variant="contained" 
          color="primary"
          onClick={() => {
            createBoard();
          }}
        >
          Create Room
      </Button>
      {/* <Button
          style={{marginLeft:'5px'}}
          variant="contained" 
          color="primary"
          onClick={() => {
            createBoard();
          }}
        >
          Create Board Room
      </Button> */}
      </div>
    </div>
  );
}

export default HomeNavbar;
