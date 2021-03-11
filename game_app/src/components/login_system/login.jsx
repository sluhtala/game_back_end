import React, { useEffect, useState } from "react";

function LoginSystem(props) {
	useEffect(() => {});
	return (
		<div className="login-content">
			<h3>Login</h3>
			<form method="GET" action="" className="login-form">
				<div className="login-form__input">
					<p className="form-text">Username:</p>
					<input
						autoFocus
						name="user"
						type="textbox"
						placeholder="Username"
						required
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
				<input
					className="button submit-button"
					name="submit"
					type="submit"
					value="Login"
				/>
			</form>
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

export default LoginSystem;
