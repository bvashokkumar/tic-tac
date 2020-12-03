import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import streamSaver from "streamsaver";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const worker = new Worker("../worker.js");

const Room = (props) => {
    const [connectionEstablished, setConnection] = useState(false);
    const [file, setFile] = useState("");
    const [gotFile, setGotFile] = useState(false);

    const chunksRef = useRef([]);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const peerRef = useRef();
    const fileNameRef = useRef("");

    const roomID = props.match.params.roomID;

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

    function handleReceivingData(data) {
        if (data.toString().includes("done")) {
            setGotFile(true);
            alert(data);

        } else {
            worker.postMessage(data);
        }
    }

    function sendFile() {
        const peer = peerRef.current;
        console.log("file", file);
        peer.write(JSON.stringify({ done: true, fileName: file }));
    }

    let body;
    if (connectionEstablished) {
        body = (
            <div>
                <TextField
                    style={{ width: '400px' }}
                    label="UID"
                    variant="filled"
                    margin="normal"
                    size="small"
                    value={file}
                    onChange={(event) => setFile(event.target.value)}
                />
                <Button
                    style={{ marginTop: '10px', width: '100px' }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        sendFile()
                    }}
                >
                    Submit
                </Button>
            </div>
        );
    } else {
        body = (
            <h1>Once you have a peer connection, you will be able to share files</h1>
        );
    }


  

    return (
        <Container>
            {body}
        </Container>
    );
};

export default Room;
