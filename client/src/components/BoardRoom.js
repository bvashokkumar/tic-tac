import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import streamSaver from "streamsaver";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { BoardUpdateContext } from "../context/boardState";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const worker = new Worker("../worker.js");

const BoardRoom = (props) => {
    const [connectionEstablished, setConnection] = useState(false);
    const [file, setFile] = useState("");
    const [gotFile, setGotFile] = useState(false);
    const [gameStart,setGameStart]=useState(false);

    const chunksRef = useRef([]);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const peerRef = useRef();
    const fileNameRef = useRef("");

    const roomID = props.match.params.roomID;


    const { board, setBoard } = useContext(BoardUpdateContext);
    const [nValue, setNValue] = useState(3);
    const [kValue, setKValue] = useState(3);
    const [nArraySize, setNArraySize] = useState(Array(8).fill().map((x, i) => i + 3));
    const [kArraySize, setKArraySize] = useState(Array(8).fill().map((x, i) => i + 3));
    const [zeroTurn, setZeroTurn] = useState(true);


    let initialValue = Array(3).fill("").map(row => new Array(3).fill(""));

    const onGameOver = () => {
        setNValue(3);
        setKValue(3);
        setBoard(initialValue);
        setZeroTurn(true);
    }


    const horizontalCheck = (currentBoard, rowIndex, colIndex) => {
        let leftMatched = 0;
        let rightMatched = 0;
        let symbol = zeroTurn ? "0" : "X";
        for (let i = colIndex; i < nValue - 1; i++) {
            if (currentBoard[rowIndex][i + 1] == symbol) {
                rightMatched = rightMatched + 1;
            } else {
                break;
            }
        }
        for (let i = colIndex; i > 0; i--) {
            if (currentBoard[rowIndex][i - 1] == symbol) {
                leftMatched = leftMatched + 1;

            } else {
                break;
            }
        }
        let totalMatched = leftMatched + rightMatched + 1;
        if (totalMatched == kValue) {
            alert(`won by ${symbol}`);
            onGameOver(initialValue);
        }

    }

    const verticalCheck = (currentBoard, rowIndex, colIndex) => {
        let bottomMatched = 0;
        let topMatched = 0;
        let symbol = zeroTurn ? "0" : "X";
        for (let i = rowIndex; i < nValue - 1; i++) {
            if (currentBoard[i + 1][colIndex] == symbol) {
                topMatched = topMatched + 1;
            } else {
                break;
            }
        }
        for (let i = rowIndex; i > 0; i--) {
            if (currentBoard[i - 1][colIndex] == symbol) {
                bottomMatched = bottomMatched + 1;

            } else {
                break;
            }
        }
        let totalMatched = bottomMatched + topMatched + 1;
        if (totalMatched == kValue) {
            alert(`won by ${symbol}`);
            onGameOver(initialValue);
        }

    }

    const leftDiagonalCheck = (currentBoard, rowIndex, colIndex) => {
        let bottomMatched = 0;
        let topMatched = 0;
        let x = rowIndex;
        let y = colIndex;
        let symbol = zeroTurn ? "0" : "X";
        while (x < nValue - 1 && y < nValue - 1) {
            y++;
            x++;
            if (currentBoard[x][y] == symbol) {
                topMatched = topMatched + 1;
            } else {
                break;
            }

        }
        x = rowIndex;
        y = colIndex;
        while (x > 0 && y > 0) {
            y--;
            x--;
            if (currentBoard[x][y] == symbol) {
                bottomMatched = bottomMatched + 1;

            } else {
                break;
            }
        }
        let totalMatched = bottomMatched + topMatched + 1;
        if (totalMatched == kValue) {
            alert(`won by ${symbol}`);
            onGameOver(initialValue);
        }


    }

    const rightDiagonalCheck = (currentBoard, rowIndex, colIndex) => {
        let bottomMatched = 0;
        let topMatched = 0;
        let x = rowIndex;
        let y = colIndex;
        let symbol = zeroTurn ? "0" : "X";
        while (x > 0 && y < nValue - 1) {
            y++;
            x--;
            if (currentBoard[x][y] == symbol) {
                topMatched = topMatched + 1;
            } else {
                break;
            }

        }
        x = rowIndex;
        y = colIndex;
        while (y > 0 && x < nValue - 1) {
            y--;
            x++;
            if (currentBoard[x][y] == symbol) {
                bottomMatched = bottomMatched + 1;

            } else {
                break;
            }
        }
        let totalMatched = bottomMatched + topMatched + 1;
        if (totalMatched == kValue) {
            alert(`won by ${symbol}`);
            onGameOver(initialValue);
        }

    }


    const handleNChange = (arg) => {
        let value = arg;
        setNValue(value);
        setKValue(value);
        setKArraySize(Array(value - 1).fill().map((x, i) => i + 2))
        let newBoard = Array(value).fill("").map(row => new Array(value).fill(""))
        setBoard(newBoard);

    };

    const setRecBoard=(newNValue, newKValue)=> {
        handleNChange(newNValue);
        handleKChange(newKValue);
        
    }

    const onBoxClick = (rowIndex, colIndex) => {
        let currentBoard = [...board];
        if (currentBoard[rowIndex][colIndex] == '') {
            setZeroTurn(!zeroTurn);
            if (zeroTurn) {
                currentBoard[rowIndex][colIndex] = "0";
            } else {
                currentBoard[rowIndex][colIndex] = "X";
            }
            setBoard(currentBoard);
            horizontalCheck(currentBoard, rowIndex, colIndex);
            verticalCheck(currentBoard, rowIndex, colIndex);
            leftDiagonalCheck(currentBoard, rowIndex, colIndex);
            rightDiagonalCheck(currentBoard, rowIndex, colIndex);
        }
    }


    const handleKChange = (value) => {
        setKValue(value);
    };

    useEffect(() => {
        socketRef.current = io.connect("/");
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", users => {
            peerRef.current = createPeer(users[0], socketRef.current.id);
        });

        socketRef.current.on("user joined", payload => {
            peerRef.current = addPeer(payload.signal, payload.callerID);

        });

        socketRef.current.on("receiving returned signal", payload => {
            peerRef.current.signal(payload.signal);
            setConnection(true);

        });

        socketRef.current.on("room full", () => {
            alert("room is full");
        })

    }, []);



    function createPeer(userToSignal, callerID) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
        });

        peer.on("data", handleReceivingData);
        return peer;
    }

    function addPeer(incomingSignal, callerID) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID });
        });

        peer.on("data", handleReceivingData);
        peer.signal(incomingSignal);
        setConnection(true);
        return peer;
    }

    const [initialNK, setInitialNK] = useState({});

    function handleReceivingData(data) {
        if (data.toString().includes("done")) {
            setGotFile(true);
            let recData = JSON.parse(data);
            const { type, id } = recData.dataObj;
            console.log("rec data", recData);
            if (type == "INITIAL") {
                const { newNValue, newKValue } = recData.dataObj;
                setInitialNK({ newKValue: newKValue, newNValue: newNValue })
                setRecBoard(newNValue,newKValue);
            }
            if (type == "INITIAL_ACCEPT") {
                const { newNValue, newKValue } = recData.dataObj;
                alert("accepted");
                setGameStart(true);
            }
            if (type == "INITIAL_REJECT") {
                alert("rejected");
            }
            if (type == "UPDATE") {
                const { rowIndex, colIndex } = recData.dataObj;
                onBoxClick(rowIndex, colIndex);
            }
        } else {
            worker.postMessage(data);
        }
    }

    function sendFile(obj) {
        const peer = peerRef.current;
        peer.write(JSON.stringify({ done: true, dataObj: obj, initiator: peer.initiator }));
    }

    function handleNKSend() {
        let obj = {
            newNValue: nValue,
            newKValue: kValue,
            type: "INITIAL"
        };
        sendFile(obj);
    }

    function handleNKRec(arg) {
        if(arg=="YES")
        {
            let obj = {
                newNValue: nValue,
                newKValue: kValue,
                type: "INITIAL_ACCEPT"
            };
            setGameStart(true);
            sendFile(obj)
        }else{
            let obj = {
                newNValue: nValue,
                newKValue: kValue,
                type: "INITIAL_REJECT"
            };
            sendFile(obj)
        }
    }

    const [updateValue,setUpdateValue]=useState(false);

    function handleBoxClick(rowIndex,colIndex){
        onBoxClick(rowIndex, colIndex);
        let obj = {
            rowIndex: rowIndex,
            colIndex: colIndex,
            type: "UPDATE"
        };
        sendFile(obj);
    }

    return (
        <>
            {peerRef.current && peerRef.current.initiator && !gameStart &&
                <div style={{ display: 'flex' }}>
                    <div style={{ margin: '25px' }}>Enter the value of n</div>
                    <Select
                        value={nValue}
                        onChange={(e) => handleNChange(e.target.value)}
                        disabled={!peerRef.current.initiator}
                    >
                        {nArraySize.map(item => {
                            return <MenuItem value={item}>{item}</MenuItem>
                        })}
                    </Select>
                    <div style={{ margin: '25px' }}>Enter the value of k</div>
                    <Select
                        value={kValue}
                        onChange={(e) => handleKChange(e.target.value)}
                        disabled={!peerRef.current.initiator}
                    >
                        {kArraySize.map(item => {
                            return <MenuItem value={item}>{item}</MenuItem>
                        })}
                    </Select>
                    <div style={{ margin: '25px' }}><Button onClick={() => handleNKSend()} variant="contained" >Send N,K</Button></div>
                </div>
            }
            {peerRef.current && !peerRef.current.initiator && !gameStart && <div style={{ display: 'flex' }}>
                <div style={{ margin: '25px' }}>N = {initialNK.newNValue}, K = {initialNK.newKValue}</div>
                <div style={{ margin: '25px' }}><Button onClick={() => handleNKRec("YES")} variant="contained" >Accept</Button></div>
                <div style={{ margin: '25px' }}><Button onClick={() => handleNKRec("NO")} variant="contained" >Reject</Button></div>
            </div>}
            <div style={{textAlign:'center',margin:'10px 0px',color:'green'}}>{gameStart?"GAME STARTED":null}</div>
            <div className="body_center" style={{ pointerEvents: connectionEstablished ? "" : "none" }}>
                {connectionEstablished ? <div style={{ margin: '25px' }}>{zeroTurn ? '0 turn now' : 'X turn now'}</div> : <div style={{ margin: '25px', color: 'red' }}>Waiting for user to join...</div>}
                {board.map((row, rowIndex) => {
                    return <div style={{ display: 'flex' }}>
                        {row.map((item, colIndex) => {
                            return <div style={{ height: '50px', width: '50px', border: 'solid 1px grey', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => { handleBoxClick(rowIndex, colIndex); console.log(rowIndex, colIndex) }}>{item}</div>
                        })}
                    </div>
                })}
            </div>
        </>
    );
};

export default BoardRoom;
