import React from "react";
import "./App.css";
import Routes from "./routes/Routes";
import { withRouter } from "react-router-dom";
import BoardUpdateProvider from "./context/boardState";


function App() {
  // const { user } = useContext(UserUpdateContext);
  // console.log(user);

  return (
    <React.Fragment>
      <BoardUpdateProvider>
          <Routes></Routes>
      </BoardUpdateProvider>
    </React.Fragment>
  );
}

export default withRouter(App);
