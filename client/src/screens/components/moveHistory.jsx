import React, { useEffect, useRef, useState } from "react";


export default function MoveHistory(props) {
    const [history, setHistory] = useState(props.history);
    const scroll = useRef()
    useEffect(() => {
        setHistory(props.history)
    }, [props.history])


    useEffect(() => {
        if (scroll) scroll.current.scrollTop = scroll.current.scrollHeight;
    }, [history])

    return (
        <>
            <div
                style={{
                    "display": "block",
                    "width": `300px`,
                    "height": "310px",
                    "border": `2px solid black`,
                    "marginTop": "3px",
                    "marginLeft":"2px"
                }}
            >
                <h3 style={{"width":"100%","margin":"0","border":"1px solid black"}}>History of Moves</h3>
                <div
                    style={{
                        "display": "block",
                        "overflowY": "scroll",
                        "height":"282px"
                    }}
                    ref={(el) => { scroll.current = el; }}>
                    {history.map((item) => {
                        return <h5>{item}</h5>
                    })}
                </div>
            </div>

        </>
    );
}