import React from "react";
import { Route, Switch } from "react-router-dom";
import { Board, Home, JoinRoom, Room,BoardRoom } from "../components";

const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/board" component={Board} />
        <Route exact path="/" component={Home} />
        <Route exact path="/join-room" component={JoinRoom} />
        <Route path="/room/:roomID" component={Room} />
        <Route path="/board-room/:roomID" component={BoardRoom} />
      </Switch>
    </div>
  );
};

export default Routes;
