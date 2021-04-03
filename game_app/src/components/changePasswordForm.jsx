import "../style/App.css";

import React, { useEffect, useState } from "react";
import LoginInput from "./login_system/formInput";
import Requests from "./login_system/requests";

function ChangePasswordForm(props) {
    let [oldPassword, setOldPassword] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let [confirmNewPassword, setConfirmNewPassword] = useState("");
    let [formWarning, setFormWarning] = useState("");
    let [validForm, setValidForm] = useState(true);
    let [username] = useState(props.username);

    useEffect(() => {
        if (!username) {
            setValidForm(false);
            setFormWarning("Invalid user.");
        }
    }, []);
    function handleChange(event) {
        if (event.target.name === "Old Password")
            setOldPassword(event.target.value);
        if (event.target.name === "New Password")
            setNewPassword(event.target.value);
        if (event.target.name === "Confirm New Password")
            setConfirmNewPassword(event.target.value);
    }

    function handleSubmit() {
        if (
            oldPassword === "" ||
            newPassword === "" ||
            confirmNewPassword === ""
        ) {
            setValidForm(false);
            setFormWarning("Fill all the fields");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setValidForm(false);
            setFormWarning("Invalid password confirmation");
            return;
        }
        let data = { username: username, oldPassword, newPassword };
        Requests.createXMLRequest(data, "/changePassword", (response) => {
            if (response.error) {
                if (response.error === "invalidpw") {
                    setValidForm(false);
                    setFormWarning("Wrong Password");
                }
            } else if (response.ok) {
                console.log("password changed");
                props.setStatus("ok");
            }
        });
    }

    return (
        <div className="App change-password-form">
            <div className="main-content">
                <div className="login-content">
                    <h3>Change Password</h3>
                    <LoginInput
                        label="Old Password"
                        value={oldPassword}
                        type="password"
                        placeholder="Old Password"
                        onChange={(event) => {
                            handleChange(event);
                        }}
                        onFocus={() => {
                            setValidForm(true);
                        }}
                    />
                    <LoginInput
                        label="New Password"
                        value={newPassword}
                        type="password"
                        placeholder="New Password"
                        onChange={(event) => {
                            handleChange(event);
                        }}
                        onFocus={() => {
                            setValidForm(true);
                        }}
                    />
                    <LoginInput
                        label="Confirm New Password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(event) => {
                            handleChange(event);
                        }}
                        placeholder="New Password"
                        onFocus={() => {
                            setValidForm(true);
                        }}
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
                    <input
                        className="button submit-button"
                        name="submit"
                        type="button"
                        value="Change Password"
                        onClick={() => {
                            handleSubmit();
                        }}
                    />
                    <div
                        role="button"
                        className="button cancel-button"
                        href="#"
                        onClick={() => {
                            props.setStatus("");
                        }}>
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordForm;
