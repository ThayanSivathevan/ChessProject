import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

import Chess from "../classes/Chess";
import styles from "./Chess.module.css"
import Tile from "./components/tile";
import UserDisplay from "./components/userDisplay"
import MoveHistory from "./components/moveHistory";
const width = 8;
const height = 8;
const positions = ["A", "B", "C", "D", "E", "F", "G", "H"]
const players = ["White", "Black"]
export default function ChessComponent() {
    const [game, setGame] = useState(new Chess());
    const [gameInfo, setGameInfo] = useState()
    const [selected, setSelected] = useState([-1, -1]);
    const [validMoves, setMoves] = useState({});
    const [socket, setSocket] = useState(null);
    const [gameId, setID] = useState();
    const [playerNum, setNum] = useState();
    const [moves, setHistory] = useState([]);
    const [name, setName] = useState();
    const params = useParams();

    useEffect(() => {
        if (params) {
            setNum(params.playerNum);
            setID(params.gameID);
            setName(params.name)
            const newSocket = io(`http://${window.location.hostname}:5000`);
            setSocket(newSocket);
            return () => newSocket.close();
        }
    }, [])


    useEffect(() => {
        if (socket) {
            const updateGame = (game, gameHis) => {
                if (game.id === gameId) {
                    setGameInfo({ ...game })
                    setGame(new Chess(game.game))
                    setHistory([...game.history])
                }
            };
            socket.on('updateGame', updateGame);
            socket.emit("connectToGame", gameId, playerNum, game)
            return () => {
                socket.off('updateGame', updateGame);

            };
        }

    }, [socket])


    const selectTile = (x, y) => {
        if (gameInfo && gameInfo.turns[playerNum] === game.turn && gameInfo.gameStart) {
            if (validMoves[`${x}_${y}`]) {
                let temp = []
                if (game.getPos(x, y))
                    temp.push(`${players[gameInfo.turns[playerNum]]} ${game.getPos(...selected).getPiece()} took ${game.getPos(x, y).getPiece()}`)
                game.movePiece(...selected, x, y)
                if (game.check[game.turn]) temp.push(`${findPlayerFromTurn(game.turn)} is in check`)
                socket.emit("updateGame",
                    gameId, playerNum, game,
                    [...moves,
                    `${name} moved ${game.getPos(x, y).getPiece()} from  ${positions[selected[0]]}${height - selected[1]} to ${positions[x]}${height - y}`,
                    ...temp])
            }
            setMoves({ ...game.getValidMoves(x, y) })

        }
        setSelected([x, y])
    }

    const findPlayerFromTurn = (num) => {
        if (gameInfo.turns[playerNum] === num) return name;
        else {
            for (let i of gameInfo.players) {
                if (i.playerID != playerNum) return i.name;
            }
        }
        return null;
    }
    return (
        <div className={styles.main}>
            <div className={styles.rightBox}>
                {gameInfo && playerNum &&
                    <UserDisplay
                        user={findPlayerFromTurn(1)}
                        turn={1}
                        isTurn={1 === game.turn && gameInfo.gameStart}
                        isPlayer={gameInfo.turns[playerNum]===1}
                    />}
                <div className={styles.game}>
                    {
                        game.getBoard().map((item, row) => {


                            return item.map((item, column) => {
                                return <Tile
                                    tile={(column % 2 + row % 2) % 2}
                                    piece={game.getPos(column, row)}
                                    selectTile={() => selectTile(column, row)}
                                    selected={selected[0] === column && selected[1] === row}
                                    validMove={validMoves[`${column}_${row}`]}
                                >

                                </Tile>
                            })



                        })
                    }
                </div>
                {gameInfo && playerNum &&
                    <UserDisplay
                        user={findPlayerFromTurn(0)}
                        turn={0}
                        isTurn={0 === game.turn && gameInfo.gameStart}
                        isPlayer={gameInfo.turns[playerNum]===0}
                    />}
            </div>
            <div className={styles.leftBox}>
                <MoveHistory history={moves} />
            </div>
        </div>
    );
}