import React, { Component } from "react";

class GameComponent extends Component {
    state = { isRunning: false, username: "test" };
    constructor(props) {
        super();
        this.state.username = sessionStorage.getItem("username-logged");
        console.log(sessionStorage.getItem("username-logged"));
    }

    logout = () => {
        let data = { username: this.state.username };
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            sessionStorage.removeItem("username-logged");
            sessionStorage.removeItem("randomId");
            if (response.redirected) window.location.href = response.url;
        });
    };

    render() {
        return (
            <>
                <h1>Hello {this.state.username}</h1>
                <input
                    type="button"
                    onClick={() => this.logout()}
                    value="Logout"
                />
            </>
        );
    }
}
export default GameComponent;
