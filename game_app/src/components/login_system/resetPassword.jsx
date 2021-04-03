import FormInput from "./formInput";
import { useState } from "react";
import Requests from "./requests";

function ResetPassword(props) {
    let [email, setEmail] = useState("");
    let [formWarning, setFormWarning] = useState("");
    let [isValidForm, setIsValidForm] = useState(true);

    function handleChange(event) {
        if (event.target.name === "Email") {
            setEmail(event.target.value);
        }
    }
    function handleSubmit() {
        const data = { email: email };
        if (email === "") {
            setFormWarning("Email required");
            setIsValidForm(false);
            return;
        }
        Requests.createFetchRequest(
            "POST",
            "/resetPasswordEmail",
            data,
            (result) => {
                if (result.error) {
                    console.log("error");
                    if (result.error === "email") {
                        setFormWarning("Invalid email address");
                        setIsValidForm(false);
                    } else if (result.error === "user") {
                        setFormWarning("No user with this email");
                        setIsValidForm(false);
                    }
                } else if (result.ok) {
                    console.log("email recieved");
                    props.setNewUserCreated("Reset password link sent");
                    props.setFormStatus("welcome");
                } else {
                    console.log(result);
                }
            }
        );
    }

    return (
        <div className="login-content">
            <h3>Reset Password</h3>
            <FormInput
                label="Email"
                name="email"
                type="text"
                value={email}
                placeholder="Email Address"
                onChange={(event) => {
                    handleChange(event);
                }}
            />
            {isValidForm === false ? (
                <div
                    className="warning-text form-warning"
                    onClick={() => {
                        setIsValidForm(true);
                    }}>
                    {formWarning}
                </div>
            ) : (
                ""
            )}
            <button
                className="button submit-button"
                onClick={() => handleSubmit()}>
                Send
            </button>
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

export default ResetPassword;
