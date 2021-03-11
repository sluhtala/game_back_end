function WelcomePage(props) {
	return (
		<div className="welcome-buttons">
			<div
				className="button"
				onClick={() => props.loginPress()}
				role="button"
				href="#"
			>
				Login
			</div>
			<div
				className="button"
				onClick={() => props.newUserPress()}
				role="button"
				href="#"
			>
				New User
			</div>
		</div>
	);
}

export default WelcomePage;
