import React, { useState, useEffect } from "react";
import "./style/App.css";
import LoginSystem from "./components/login_system/login.jsx";
import WelcomePage from "./components/login_system/welcome.jsx";
import NewUser from "./components/login_system/newUser";
import ResetPassword from "./components/login_system/resetPassword";
import PopupMessage from "./components/popup";

function App() {
    let [newuserCreated, setNewUserCreated] = useState("");
    let [status, setStatus] = useState("welcome");
    let [content, setContent] = useState(
        <WelcomePage
            loginPress={() => setStatus("login")}
            newUserPress={() => setStatus("newUser")}
        />
    );

    useEffect(() => {
        if (status === "welcome") {
            setContent(
                <WelcomePage
                    loginPress={() => setStatus("login")}
                    newUserPress={() => setStatus("newUser")}
                    setNewUserCreated={() => setNewUserCreated(true)}
                />
            );
        } else if (status === "login") {
            setContent(
                <LoginSystem setFormStatus={(status) => setStatus(status)} />
            );
        } else if (status === "newUser") {
            setContent(
                <NewUser
                    setFormStatus={() => setStatus("welcome")}
                    setNewUserCreated={(text) => {
                        setNewUserCreated(text);
                    }}
                />
            );
        } else if (status === "resetPassword") {
            setContent(
                <ResetPassword
                    setNewUserCreated={(text) => {
                        setNewUserCreated(text);
                    }}
                    setFormStatus={() => setStatus("welcome")}
                />
            );
        }
    }, [status]);
    /*
    useEffect(() => {
        if (newuserCreated === "") return;
        let popup = newuserRef.current;
        if (popup) popup.classList.toggle("popup-active");
        setTimeout(() => {
            setNewUserCreated("");
            popup.classList.toggle("popup-active");
        }, 3000);
    }, [newuserCreated]);
	*/
    return (
        <div className="App">
            <PopupMessage
                popUpText={newuserCreated}
                time={3000}
                setPopUpText={setNewUserCreated}
            />
            <h1>Hello, welcome to the login page.</h1>
            <div className="main-content">{content}</div>
        </div>
    );
}

export default App;
