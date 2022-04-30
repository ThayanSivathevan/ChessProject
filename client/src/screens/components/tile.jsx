import React, { useEffect, useState } from "react";



const squareSide = 65;
const border = 5
const imageSize = 40;
export default function Tile(props) {
    const [tile, setTile] = useState(props.tile === 0 ? 2 : 1);
    const [piece, setPiece] = useState(props.piece)
    const [selected, setSelected] = useState(props.selected)
    const [validMove, setValidMove] = useState(props.validMove)
    useEffect(() => {
        setPiece(props.piece)
    }, [props.piece])

    useEffect(() => {
        setSelected(props.selected)
    }, [props.selected])

    useEffect(() => {
        setValidMove(props.validMove)
    }, [props.validMove])

    return (
        <>
            {tile &&
                <div onClick={(e) => props.selectTile()} style={{
                    "backgroundColor": `${tile === 2 ? "#873e23" : "#ec6e2e"}`,
                    "width": selected ? `${squareSide - 2 * border}px` : `${squareSide}px`,
                    "height": selected ? `${squareSide - 2 * border}px` : `${squareSide}px`,
                    "border": selected ? `${border}px solid gray` : "none",
                    "display": "flex",
                    "justifyContent": "center",
                    "alignItems": "center"
                }}>
                    {piece ? <img
                        width={imageSize}
                        height={imageSize}
                        style={{
                            "borderRadius": validMove ? "50%" : "0%",
                            "border": `${validMove ? border : 0}px solid gray`,
                        }}
                        alt=""
                        src={require(`./chessImages/${piece.getPlayer() === 0 ? "w" : "b"}_${piece.getPiece()}_png_256px.png`)}></img>
                        :
                        <div style={{
                            "borderRadius": "50%",
                            "display": validMove ? "block" : "none",
                            "width": `${squareSide / 4}px`,
                            "height": `${squareSide / 4}px`,
                            "border": `${border}px solid gray`,
                        }}></div>}
                </div>
            }
        </>
    );
}