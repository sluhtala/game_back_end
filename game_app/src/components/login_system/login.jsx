import React, { useEffect, useState } from "react";
import FormInput from "./formInput";
import Requests from "./requests";

function LoginSystem(props) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [validLogin, setValidLogin] = useState(true);
    const [warning, setWarning] = useState("");
    useEffect(() => {
        if (validLogin === false) setWarning("Invalid login.");
    }, [validLogin]);
    function handleSubmit() {
        const STATUSES = { sending: 0, ok: 1, invalid_login: 2, error: 3 };
        Object.freeze(STATUSES);
        if (user === "" || password === "") {
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
                console.log("invalid login");
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
            <form className="login-form">
                <FormInput
                    label="Username"
                    placeholder="Your username"
                    value={user}
                    onChange={(event) => handleChange(event)}
                    onFocus={() => setValidLogin(true)}
                />
                <FormInput
                    type="password"
                    label="Password"
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => handleChange(event)}
                />
                <a href="/resetPassword">Forgot password?</a>
                <input
                    className="button submit-button"
                    onClick={() => handleSubmit()}
                    name="submit"
                    type="button"
                    value="Login"
                />
            </form>
            <div
                role="button"
                className="button cancel-button"
                href="#"
                onClick={props.setFormStatus}>
                Cancel
            </div>
        </div>
    );
}

export default LoginSystem;
