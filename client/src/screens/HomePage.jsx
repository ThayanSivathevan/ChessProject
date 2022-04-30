import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const [username, setUsername] = useState("")
    const history = useNavigate()

    const submitData = () => {
        fetch(`http://localhost:5000/connectToGame/${username}/${new Date().getTime()}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
          .then((data) => {
                if(data){
                    history(`/chess/${data.game}/${data.player}/${username}`)
                }
            })
    }
    return (
        <div>
            <input type="text" onChange={(e) => { setUsername(e.target.value) }}></input>
            <button onClick={submitData}>Submit Name</button>
        </div>
    )
}