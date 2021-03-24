import FormInput, { FormInputRef } from "./formInput.jsx";
import React from "react";

const NewUserForm = React.forwardRef((props, ref) => {
    return (
        <form
            className="login-form"
            onFocus={() => props.setValidForm(true)}
            onKeyDown={(e) => {
                if (e.keyCode === 13) props.handleSubmit();
            }}>
            <FormInputRef
                ref={ref}
                label="Username"
                value={props.userVal}
                onFocus={() => props.setNameAvailable(true)}
                onChange={(event) => props.changeHandle(event)}
                placeholder="Username"
            />
            <FormInput
                label="Email"
                value={props.emailVal}
                onChange={(event) => props.changeHandle(event)}
                placeholder="email@email.com"
            />
            <FormInput
                label="Password"
                value={props.passwordVal}
                onChange={(event) => props.changeHandle(event)}
                placeholder="password123!@#$"
                type="password"
            />
            <FormInput
                label="Confirm password"
                value={props.confirmPasswordVal}
                onChange={(event) => props.changeHandle(event)}
                placeholder=""
                type="password"
            />
            <input
                className="button submit-button"
                name="submit"
                type="button"
                value="Create New User"
                onClick={() => {
                    props.handleSubmit();
                }}
                disabled={props.nameAvailable === false ? true : false}
            />
        </form>
    );
});

export default NewUserForm;
