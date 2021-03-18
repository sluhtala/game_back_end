import React, { useState, useEffect, useRef } from "react";
import FormInput, { FormInputRef } from "./formInput.jsx";

//document.getElementById("").shadowRoot.lastChild.

function isNameAvailable(newName) {
    //xhtmlRequest;
    var names = ["sasu", "test", "testi"];
    var ret = names.find((name) => name === newName);
    if (ret) return false;
    else return true;
}
function NewUser(props) {
    let [userVal, setUserVal] = useState("");
    let userRef = useRef(null);
    let [emailVal, setEmailVal] = useState("");
    let [passwordVal, setPasswordVal] = useState("");
    let [confirmPasswordVal, setConfirmPasswordVal] = useState("");
    let [nameAvailable, setNameAvailable] = useState(true);
    let [warning, setWarning] = useState("");

    function changeHandle(event) {
        if (event.target.name === "Username") {
            setUserVal(event.target.value);
            blurHandle(event);
        }
        if (event.target.name === "Email") setEmailVal(event.target.value);
        if (event.target.name === "Password")
            setPasswordVal(event.target.value);
        if (event.target.name === "Confirm password")
            setConfirmPasswordVal(event.target.value);
    }

    let blurHandle = (event) => {
        let available = isNameAvailable(event.target.value);
        setNameAvailable(available);
    };

    useEffect(() => {
        setWarning(nameAvailable === false ? "name not available" : "");
    }, [nameAvailable]);

    function submitHandle() {
        console.log("submit");
    }
    return (
        <div className="login-content">
            <h3>New User</h3>
            {nameAvailable === false ? (
                <div
                    className="warning-text"
                    onClick={() => {
                        setNameAvailable(true);
                        if (userRef.current) userRef.current.focus();
                    }}>
                    {warning}
                </div>
            ) : (
                ""
            )}
            <form onSubmit={() => submitHandle()} className="login-form">
                <FormInputRef
                    ref={userRef}
                    label="Username"
                    value={userVal}
                    onBlur={(event) => blurHandle(event)}
                    onFocus={() => setNameAvailable(true)}
                    onChange={(event) => changeHandle(event)}
                    placeholder="Username"
                />
                <FormInput
                    label="Email"
                    value={emailVal}
                    onChange={(event) => changeHandle(event)}
                    placeholder="email@email.com"
                />
                <FormInput
                    label="Password"
                    value={passwordVal}
                    onChange={(event) => changeHandle(event)}
                    placeholder="password123!@#$"
                    type="password"
                />
                <FormInput
                    label="Confirm password"
                    value={confirmPasswordVal}
                    onChange={(event) => changeHandle(event)}
                    placeholder=""
                    type="password"
                />
                <input
                    className="button submit-button"
                    name="submit"
                    type="submit"
                    value="Create New User"
                    disabled={nameAvailable === false ? true : false}
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

export default NewUser;
