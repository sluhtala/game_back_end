import { useRef, useState, useEffect } from "react";
import "../App.css";

function PopupMessage(props) {
    const popUpRef = useRef(null);
    const [popUpText, setPopUpText] = useState(props.popUpText);

    useEffect(() => {
        if (popUpText === "") return;
        let popup = popUpRef.current;
        if (popup) popup.classList.toggle("popup-active");
        setTimeout(
            () => {
                if (props.setPopUpText) props.setPopUpText("");
                popup.classList.toggle("popup-active");
            },
            props.time ? props.time : 3000
        );
    }, [popUpText]);

    useEffect(() => {
        setPopUpText(props.popUpText);
    });

    return (
        <>
            <div ref={popUpRef} className="new-user-popup">
                {popUpText !== "" ? <h3>{popUpText}</h3> : ""}
            </div>
        </>
    );
}

export default PopupMessage;
