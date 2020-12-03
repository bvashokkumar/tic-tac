// import styled from "styled-components";
import React from "react";
import { BoardUpdateContext } from "../context/boardState";
import { useContext, useState } from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function Board() {
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
                console.log("rightMatched", rightMatched);
            } else {
                break;
            }
        }
        for (let i = colIndex; i > 0; i--) {
            if (currentBoard[rowIndex][i - 1] == symbol) {
                leftMatched = leftMatched + 1;
                console.log("leftMatched", leftMatched);

            } else {
                break;
            }
        }
        let totalMatched = leftMatched + rightMatched + 1;
        console.log("total matched", totalMatched);
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
                console.log("topMatched", topMatched);
            } else {
                break;
            }
        }
        for (let i = rowIndex; i > 0; i--) {
            if (currentBoard[i - 1][colIndex] == symbol) {
                bottomMatched = bottomMatched + 1;
                console.log("bottomMatched", bottomMatched);

            } else {
                break;
            }
        }
        let totalMatched = bottomMatched + topMatched + 1;
        console.log("total matched", totalMatched);
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
                console.log("topMatched", topMatched);
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
                console.log("bottomMatched", bottomMatched);

            } else {
                break;
            }
        }
        let totalMatched = bottomMatched + topMatched + 1;
        console.log("total matched", totalMatched);
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
                console.log("topMatched", topMatched);
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
                console.log("bottomMatched", bottomMatched);

            } else {
                break;
            }
        }
        let totalMatched = bottomMatched + topMatched + 1;
        console.log("total matched", totalMatched);
        if (totalMatched == kValue) {
            alert(`won by ${symbol}`);
            onGameOver(initialValue);
        }

    }


    const handleNChange = (event) => {
        let value = event.target.value;
        setNValue(value);
        setKValue(value);
        setKArraySize(Array(value - 1).fill().map((x, i) => i + 2))
        let newBoard = Array(value).fill("").map(row => new Array(value).fill(""))
        setBoard(newBoard);
    };

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


    const handleKChange = (event) => {
        setKValue(event.target.value);
    };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ margin: '25px' }}>Enter the value of n</div>
                <Select
                    value={nValue}
                    onChange={handleNChange}
                >
                    {nArraySize.map(item => {
                        return <MenuItem value={item}>{item}</MenuItem>
                    })}
                </Select>
                <div style={{ margin: '25px' }}>Enter the value of k</div>
                <Select
                    value={kValue}
                    onChange={handleKChange}
                >
                    {kArraySize.map(item => {
                        return <MenuItem value={item}>{item}</MenuItem>
                    })}
                </Select>
                <div style={{ margin: '25px' }}>0 turn first always</div>
            </div>

            <div className="body_center">
                <div style={{ margin: '25px' }}>{zeroTurn ? '0 turn now' : 'X turn now'}</div>
                {board.map((row, rowIndex) => {
                    return <div style={{ display: 'flex' }}>
                        {row.map((item, colIndex) => {
                            return <div style={{ height: '50px', width: '50px', border: 'solid 1px grey', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => { onBoxClick(rowIndex, colIndex); console.log(rowIndex, colIndex) }}>{item}</div>
                        })}
                    </div>
                })}
            </div>
        </>
    );
}

export default Board;
