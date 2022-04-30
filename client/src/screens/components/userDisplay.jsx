import React, { useEffect, useRef, useState } from "react";

const imageSize = 50;
const border = 5;
export default function UserDisplay(props) {
    const [user, setUser] = useState(props.user);
    const [turn, setTurn] = useState(props.turn)
    const [isTurn, setIsTurn] = useState(props.isTurn)
    const player = useRef(props.isPlayer)

    useEffect(() => {
        setUser(props.user)
    }, [props.user])

    useEffect(() => {
        setTurn(props.turn)
    }, [props.turn])

    useEffect(() => {
        setIsTurn(props.isTurn)
    }, [props.isTurn])


    return (
        <>
            <div style={{
                "display": "inline-flex",
                "width": `calc(100% - ${4}px`,
                "height": "50px",
                "border": `2px solid black`,
                "marginTop": "3px",
                "alignItems": "center"
            }}>
                <img
                    style={{
                        "border": isTurn ? `${border}px solid green` : `${border}px solid black`,
                        "marginRight": "2px"
                    }}
                    width={imageSize - border * 2}
                    height={imageSize - border * 2}
                    src={require(`./chessImages/${turn === 0 ? "w" : "b"}_pawn_png_256px.png`)}
                    alt="">
                </img>
                <div style={{
                    "display": "block",
                    "height": "auto",
                    "width": "auto"
                }}>
                    <h4 style={{
                        margin: "0"
                    }} >{user ? `User: ${user}` : "Finding User"} </h4>
                    {isTurn ? <h5 style={{
                        margin: "0"
                    }}>{player.current ? "Your" : `${user}'s`} turn</h5> : <h5></h5>}
                </div>
            </div>

        </>
    );
}