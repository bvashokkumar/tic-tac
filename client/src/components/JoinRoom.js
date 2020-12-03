import React from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

function JoinRoom() {
    const [uid, setuid] = useState("");
    let history = useHistory();

    const onSubmit = () => {
        console.log(uid);
        history.push(`/board-room/${uid}`);
    }

    return (
        <>
            <div className="body_center">
                <div style={{ fontSize: "2rem", color: "#514F4F", marginBottom: '10px' }}>
                    Enter the room ID to join
                </div>
                <TextField
                    style={{ width: '400px' }}
                    label="ID"
                    variant="filled"
                    margin="normal"
                    size="small"
                    value={uid}
                    onChange={(event) => setuid(event.target.value)}
                />
                <Button
                    style={{ marginTop: '10px', width: '100px' }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        onSubmit()
                    }}
                >
                    Submit
                </Button>
            </div>
        </>
    );
}

export default JoinRoom;