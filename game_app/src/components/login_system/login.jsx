import React, { useEffect, useState } from "react";
import Requests from "./requests";
import Cookies from "../cookie_handle";
import LoginForm from "./loginForm";

function LoginSystem(props) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [validLogin, setValidLogin] = useState(true);
    const [warning, setWarning] = useState("");
    useEffect(() => {
        let cookie_user = Cookies.getCookie("login-username");
        if (cookie_user !== "") {
            setUser(cookie_user);
        }
    }, []);
    function handleSubmit() {
        const STATUSES = {
            sending: 0,
            ok: 1,
            invalid_login: 2,
            error: 3,
            disabled: 4,
        };
        Object.freeze(STATUSES);
        if (user === "" || password === "") {
            setWarning("Invalid login.");
            setValidLogin(false);
            return;
        }
        let data = {
            username: user,
            password: password,
            status: STATUSES.sending,
            randomId: "",
        };
        Requests.createXMLRequest(data, "/login", (val) => {
            if (val.status === STATUSES.ok) {
                console.log("login ok");
                sessionStorage.setItem("randomId", val.randomId);
                data.randomId = val.randomId;
                data.status = val.status;
                Cookies.setCookie("login-username", data.username, 14);
                Requests.createFetchRequest(
                    "POST",
                    "/login",
                    data,
                    (response) => {
                        sessionStorage.setItem(
                            "username-logged",
                            data.username
                        );
                        console.log(response);
                        if (response.redirected)
                            window.location.href = response.url;
                    }
                );
            } else if (val.status === STATUSES.invalid_login) {
                setWarning("Invalid login.");
                setValidLogin(false);
            } else if (val.status === STATUSES.disabled) {
                setWarning("User disabled.");
                setValidLogin(false);
            }
        });
        return true;
    }
    function handleChange(event) {
        if (event.target.name === "Username") setUser(event.target.value);
        if (event.target.name === "Password") setPassword(event.target.value);
    }
    return (
        <div className="login-content">
            {validLogin === false ? (
                <div
                    className="warning-text"
                    onClick={() => {
                        setValidLogin(true);
                    }}>
                    {warning}
                </div>
            ) : (
                ""
            )}
            <h3>Login</h3>
            <LoginForm
                password={password}
                user={user}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                setValidLogin={setValidLogin}
                setFormStatus={(status) => {
                    props.setFormStatus(status);
                }}
            />
            <div
                role="button"
                className="button cancel-button"
                href="#"
                onClick={() => props.setFormStatus("welcome")}>
                Cancel
            </div>
        </div>
    );
}

export default LoginSystem;
