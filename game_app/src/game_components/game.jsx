import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import Sketch from "./sketch.js";
import { io } from "socket.io-client";
const socket = io();

function GameComponent(props) {
    const [gameEnable, setGameEnable] = useState(true);
    const [message, setMessage] = useState("");
    const [sendingMessage, setSendginMessage] = useState("");
    const [sliderColor, setSliderColor] = useState([255, 0, 0]);
    const messageRef = useRef(null);

    useEffect(() => {}, []);

    function handleChange(event) {
        if (event.target.name === "message") {
            if (message.length < 30) setMessage(event.target.value);
        }
        if (event.target.name === "red") {
            let r = event.target.value;
            setSliderColor([r, sliderColor[1], sliderColor[2]]);
        }
        if (event.target.name === "green") {
            let g = event.target.value;
            setSliderColor([sliderColor[0], g, sliderColor[2]]);
        }
        if (event.target.name === "blue") {
            let b = event.target.value;
            setSliderColor([sliderColor[0], sliderColor[1], b]);
        }
    }
    let sendMessage = (event) => {
        setSendginMessage(message);
        messageRef.current.blur();
        setGameEnable(true);
    };
    useEffect(() => {
        console.log("enable: " + gameEnable);
    }, [gameEnable]);
    return (
        <>
            <div onClick={() => setGameEnable(true)}>
                <Sketch
                    enable={gameEnable}
                    message={sendingMessage}
                    messageSent={() => {
                        setMessage("");
                        setSendginMessage("");
                    }}
                    useChat={() => {
                        if (gameEnable) {
                            setGameEnable(false);
                            messageRef.current.focus();
                        }
                    }}
                    color={sliderColor}
                    socket={socket}
                />
            </div>
            <span>Chat:</span>
            <input
                ref={messageRef}
                onFocus={() => {
                    setGameEnable(false);
                }}
                className="input-form"
                label="message"
                name="message"
                type="text"
                onChange={(e) => {
                    handleChange(e);
                }}
                onKeyDown={(event) => {
                    if (event.keyCode === 13) sendMessage(event);
                }}
                value={message}></input>
            <input
                className="slider--red"
                type="range"
                name="red"
                min="0"
                max="255"
                onChange={(e) => {
                    handleChange(e);
                }}
                defaultValue="255"></input>
            <input
                className="slider--green"
                type="range"
                name="green"
                min="0"
                max="255"
                onChange={(e) => {
                    handleChange(e);
                }}
                defaultValue="0"></input>
            <input
                className="slider--blue"
                type="range"
                name="blue"
                min="0"
                max="255"
                onChange={(e) => {
                    handleChange(e);
                }}
                defaultValue="0"></input>
        </>
    );
}
export default GameComponent;
