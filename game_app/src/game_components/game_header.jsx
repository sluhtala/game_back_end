import { useState, useEffect, useRef } from "react";
import Requests from "../components/login_system/requests";
import PopupMessage from "../components/popup";

function GameHeader(props) {
    const [usernameLogged, setUsernameLogged] = useState(
        sessionStorage.getItem("username-logged")
    );
    const [popUpText, setPopUpText] = useState("");
    const popUpRef = useRef(null);

    let logout = () => {
        let data = { username: usernameLogged };
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            sessionStorage.removeItem("username-logged");
            sessionStorage.removeItem("randomId");
            if (response.redirected) window.location.href = response.url;
        });
    };

    let deleteAccount = () => {
        let data = {
            username: sessionStorage.getItem("username-logged"),
            randomId: sessionStorage.getItem("randomId"),
        };
        Requests.createFetchRequest(
            "POST",
            "/deleteUser",
            data,
            (response) => {
                if (response.error) {
                    console.log("error deleting account");
                }
                console.log("response: " + response);
                if (response.ok) {
                    console.log("account deleted");
                    setPopUpText("User deleted");
                    setTimeout(() => {
                        console.log("redirecting to home");
                        Requests.createFetchRequest(
                            "GET",
                            "/",
                            null,
                            (res) => {
                                window.location.href = res.url;
                            },
                            (e) => {
                                console.log(e);
                            }
                        );
                    }, 5000);
                }
            },
            () => {
                console.error("error creating request");
            }
        );
    };

    return (
        <div className="game-header">
            <div className="game-header-element game-logo">
                <p> logo </p>
            </div>
            <div className="game-header-element">
                <p className="logged">
                    Logged in as <span>{usernameLogged}</span>
                </p>
            </div>
            <div className="hamburger">
                <div className="hamburger--1" />
                <div className="hamburger--2" />
                <div className="hamburger--3" />
                <div className="info-dropdown">
                    <ul>
                        <li
                            onClick={() => {
                                logout();
                            }}>
                            <a>Logout</a>
                        </li>
                        <li>
                            <a>Change Password</a>
                        </li>
                        <li
                            onClick={() => {
                                deleteAccount();
                            }}>
                            <a>Delete Account</a>
                        </li>
                    </ul>
                </div>
            </div>
            <PopupMessage popUpText={popUpText} />
        </div>
    );
}

export default GameHeader;
