import React, { useState, useEffect } from "react";
import "./App.css";
import LoginSystem from "./components/login_system/login.jsx";
import WelcomePage from "./components/login_system/welcome.jsx";
import NewUser from "./components/login_system/newUser";

function App() {
	let [status, setStatus] = useState("welcome");
	let [content, setContent] = useState(
		<WelcomePage
			loginPress={() => setStatus("login")}
			newUserPress={() => setStatus("newUser")}
		/>
	);

	useEffect(() => {
		if (status === "welcome") {
			setContent(
				<WelcomePage
					loginPress={() => setStatus("login")}
					newUserPress={() => setStatus("newUser")}
				/>
			);
		} else if (status === "login") {
			setContent(
				<LoginSystem setFormStatus={() => setStatus("welcome")} />
			);
		} else if (status === "newUser") {
			setContent(<NewUser setFormStatus={() => setStatus("welcome")} />);
		}
	}, [status]);
	return (
		<div className="App">
			<h1>Hello, welcome to the game.</h1>
			<div className="main-content">{content}</div>
		</div>
	);
}

export default App;
