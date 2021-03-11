import React, { useState, useRef } from "react";

//document.getElementById("").shadowRoot.lastChild.
function isNameAvailable(newName) {
	console.log(newName);
	var names = ["sasu", "test", "testi"];
	var ret = names.find((name) => name === newName);
	if (ret) return false;
	else return true;
}
function NewUser(props) {
	let [userVal, setUserVal] = useState("");
	let [nameAvailable, setNameAvailable] = useState(true);
	let [warning, setWarning] = useState("");
	function changeHandle(event) {
		setUserVal(event.target.value);
	}

	function submitHandle() {}

	return (
		<div className="login-content">
			<h3>New User</h3>
			<form method="GET" action="" className="login-form">
				<div className="login-form__input">
					<p className="form-text">Username:</p>
					<input
						autoFocus
						required
						pattern="^[A-Za-z]*$"
						name="user"
						type="text"
						value={userVal}
						onFocus={() => setNameAvailable(true)}
						onChange={(event) => changeHandle(event)}
						onBlur={(event) => {
							setNameAvailable(
								isNameAvailable(event.target.value)
							);
							//setWarning("Invalid name");
						}}
						placeholder="Username"
					/>
				</div>
				<div className="login-form__input">
					<p className="form-text">Email:</p>
					<input
						required
						name="user"
						type="textbox"
						placeholder="email@email.com"
					/>
				</div>
				<div className="login-form__input">
					<p className="form-text">Password:</p>
					<input
						required
						name="password"
						type="password"
						placeholder="Password"
					/>
				</div>
				<div className="login-form__input">
					<p className="form-text">Confirm password:</p>
					<input
						required
						name="password-confirm"
						type="password"
						placeholder="Password"
					/>
				</div>
				<input
					className="button submit-button"
					name="submit"
					type="submit"
					value="Create New User"
				/>
			</form>
			{nameAvailable === false ? (
				<div className="warning-text">{warning}</div>
			) : (
				""
			)}
			<div
				role="button"
				className="button cancel-button"
				href="#"
				onClick={props.setFormStatus}
			>
				Cancel
			</div>
		</div>
	);
}

export default NewUser;
