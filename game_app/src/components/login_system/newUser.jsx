import React, { useState, useEffect, useRef } from "react";
import Requests from "./requests";
import { validateForm } from "./validateForm.js";
import NewUserForm from "./newUserForm";

function isNameAvailable(newName, setNameAvailable) {
    //xhtmlRequest;
    let res = true;
    if (newName.length < 3) return true;
    let data = { username: newName };
    Requests.createXMLRequest(data, "/nameCheck", (value) => {
        if (value.result === true) setNameAvailable(true);
        else if (value.result === false) setNameAvailable(false);
        return res;
    });
}
function NewUser(props) {
    let [userVal, setUserVal] = useState("");
    let [emailVal, setEmailVal] = useState("");
    let [passwordVal, setPasswordVal] = useState("");
    let [confirmPasswordVal, setConfirmPasswordVal] = useState("");
    let [nameAvailable, setNameAvailable] = useState(true);
    let [nameWarning, setNameWarning] = useState("");
    let [validForm, setValidForm] = useState(true);
    let [formWarning, setFormWarning] = useState("");
    let userRef = useRef(null);

    function handleChange(event) {
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
            (response) => {
                console.log(response);
                response.json().then((body) => {
                    if (body.isValid === true) {
                        props.setNewUserCreated(
                            "New user created. Check your inbox."
                        );
                        props.setFormStatus();
                    } else {
                        setValidForm(false);
                        setFormWarning("Username or email already in use.");
                    }
                });
            },
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
            <NewUserForm
                ref={userRef}
                userVal={userVal}
                emailVal={emailVal}
                passwordVal={passwordVal}
                confirmPasswordVal={confirmPasswordVal}
                setNameAvailable={setNameAvailable}
                setValidForm={setValidForm}
                handleSubmit={handleSubmit}
                changeHandle={handleChange}
                nameAvailable={nameAvailable}
            />
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
