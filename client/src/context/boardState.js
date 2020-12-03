import React, { useState, createContext } from "react";

export const BoardUpdateContext = createContext({});

const BoardUpdateProvider = (props) => {
  const [board, setBoard] = useState(Array(3).fill("").map(row => new Array(3).fill("")));

  return (
    <BoardUpdateContext.Provider value={{ board, setBoard }}>
      {props.children}
    </BoardUpdateContext.Provider>
  );
};

export default BoardUpdateProvider;
