import { useEffect, useState } from "react";
import Requests from "../components/login_system/requests";
import PopupMessage from "../components/popup";
import ChangePasswordForm from "../components/changePasswordForm";
import { Beforeunload } from "react-beforeunload";

function GameHeader(props) {
    const [usernameLogged, setUsernameLogged] = useState(
        sessionStorage.getItem("username-logged")
    );
    const [randomId, setRandomId] = useState(
        sessionStorage.getItem("randomId")
    );
    const [popUpText, setPopUpText] = useState("");
    const [changePasswordStatus, setChangePasswordStatus] = useState("");

    let logout = () => {
        if (!usernameLogged) return;
        let data = { username: usernameLogged, randomId: randomId };
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            sessionStorage.removeItem("username-logged");
            sessionStorage.removeItem("randomId");
            setUsernameLogged("");
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

    let changePassword = () => {
        setChangePasswordStatus("change");
    };

    useEffect(() => {
        window.onunload = () => {
            logout();
        };
    }, []);
    useEffect(() => {
        if (changePasswordStatus === "") return;
        if (changePasswordStatus === "ok") {
            setPopUpText("Password Changed");
            setChangePasswordStatus("");
        }
    }, [changePasswordStatus]);

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
                            <span>Logout</span>
                        </li>
                        <li
                            onClick={() => {
                                changePassword();
                            }}>
                            <span>Change Password</span>
                        </li>
                        <li
                            onClick={() => {
                                deleteAccount();
                            }}>
                            <span>Delete Account</span>
                        </li>
                    </ul>
                </div>
            </div>
            <PopupMessage popUpText={popUpText} />
            {changePasswordStatus === "change" ? (
                <ChangePasswordForm
                    username={sessionStorage.getItem("username-logged")}
                    setStatus={(status) => {
                        setChangePasswordStatus(status);
                    }}
                />
            ) : (
                ""
            )}
        </div>
    );
}

export default GameHeader;
