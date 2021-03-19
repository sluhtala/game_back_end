import React, { useState, useEffect, useRef } from "react";
import FormInput, { FormInputRef } from "./formInput.jsx";
import Requests from "./requests";
import { validateForm } from "./validateForm.js";
//document.getElementById("").shadowRoot.lastChild.

function isNameAvailable(newName, setNameAvailable) {
    //xhtmlRequest;
    let res = true;
    if (newName.length < 3) return true;
    let data = { username: newName };
    Requests.createXMLRequest(data, "/nameCheck", (value) => {
        if (value.result === true) setNameAvailable(true);
        else if (value.result === false) setNameAvailable(false);
        console.log(value);
        return res;
    });
}
function NewUser(props) {
    let [userVal, setUserVal] = useState("");
    let userRef = useRef(null);
    let [emailVal, setEmailVal] = useState("");
    let [passwordVal, setPasswordVal] = useState("");
    let [confirmPasswordVal, setConfirmPasswordVal] = useState("");
    let [nameAvailable, setNameAvailable] = useState(true);
    let [nameWarning, setNameWarning] = useState("");
    let [validForm, setValidForm] = useState(true);
    let [formWarning, setFormWarning] = useState("");

    function changeHandle(event) {
        if (event.target.name === "Username") {
            setUserVal(event.target.value);
            isNameAvailable(event.target.value, (value) => {
                setNameAvailable(value);
            });
        }
        if (event.target.name === "Email") setEmailVal(event.target.value);
        if (event.target.name === "Password")
            setPasswordVal(event.target.value);
        if (event.target.name === "Confirm password")
            setConfirmPasswordVal(event.target.value);
    }

    useEffect(() => {
        const notvalidnameText = "Username already taken";
        setNameWarning(nameAvailable === false ? notvalidnameText : "");
    }, [nameAvailable]);

    function handleSubmit() {
        const inputs = {
            username: userVal,
            email: emailVal,
            password: passwordVal,
            confirmpassword: confirmPasswordVal,
        };
        if (
            validateForm(
                (text) => setFormWarning(text),
                (value) => {
                    setValidForm(value);
                },
                inputs
            ) === false
        )
            return;
        Requests.createFetchRequest(
            "POST",
            "/newUser",
            inputs,
            (response) => {},
            (e) => {
                console.log(e);
            }
        );
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
                    {nameWarning}
                </div>
            ) : (
                ""
            )}
            <form className="login-form" onFocus={() => setValidForm(true)}>
                <FormInputRef
                    ref={userRef}
                    label="Username"
                    value={userVal}
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
                    type="button"
                    value="Create New User"
                    onClick={() => {
                        handleSubmit();
                    }}
                    disabled={nameAvailable === false ? true : false}
                />
            </form>
            {validForm === false ? (
                <div
                    className="warning-text form-warning"
                    onClick={() => {
                        setValidForm(true);
                    }}>
                    {formWarning}
                </div>
            ) : (
                ""
            )}
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
