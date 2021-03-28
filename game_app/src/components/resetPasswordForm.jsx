import "../App.css";

import React, { Component } from "react";
import LoginInput from "./login_system/formInput";
import Requests from "./login_system/requests";

class ResetPasswordForm extends Component {
    state = {
        newPassword: "",
        confirmNewPassword: "",
        formWarning: "",
        validForm: true,
    };

    handleChange = (event) => {
        let newstate = {};
        if (event.target.name === "New Password")
            newstate.newPassword = event.target.value;
        else if (event.target.name === "Confirm New Password")
            newstate.confirmNewPassword = event.target.value;
        this.setState(newstate);
    };
    handleSubmit = () => {
        if (!this.state.newPassword) {
            this.setState({
                formWarning: "Password required",
                validForm: false,
            });
            return;
        }
        if (this.state.newPassword !== this.state.confirmNewPassword) {
            this.setState({
                formWarning: "Invalid password confirmation",
                validForm: false,
            });
            return;
        }
        //validate password
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let data = {
            user: urlParams.get("user"),
            key: urlParams.get("key"),
            newPassword: this.state.newPassword,
        };
        Requests.createFetchRequest(
            "POST",
            "/resetPassword",
            data,
            (result) => {
                if (result.redirected) window.location.href = result.url;
                else if (result.error) {
                    this.setState({
                        formWarning: "Error reseting password",
                        validForm: false,
                    });
                }
            },
            (error) => {
                console.error(error);
                this.setState({
                    formWarning: "Error reseting password",
                    validForm: false,
                });
            }
        );
    };

    render() {
        return (
            <div className="App">
                <div className="main-content">
                    <div className="login-content">
                        <LoginInput
                            label="New Password"
                            value={this.state.newPassword}
                            type="password"
                            placeholder="New Password"
                            onChange={(event) => {
                                this.handleChange(event);
                            }}
                        />
                        <LoginInput
                            label="Confirm New Password"
                            type="password"
                            value={this.state.confirmNewPassword}
                            onChange={(event) => {
                                this.handleChange(event);
                            }}
                            placeholder="New Password"
                        />
                        {this.state.validForm === false ? (
                            <div
                                className="warning-text form-warning"
                                onClick={() => {
                                    this.setState({ validForm: true });
                                }}>
                                {this.state.formWarning}
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
                                this.handleSubmit();
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ResetPasswordForm;
