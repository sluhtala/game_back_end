import FormInput from "./formInput";

function LoginForm(props) {
    return (
        <form
            className="login-form"
            onKeyDown={(e) => {
                if (e.keyCode === 13) props.handleSubmit();
            }}>
            <FormInput
                label="Username"
                placeholder="Your username"
                value={props.user}
                onChange={(event) => props.handleChange(event)}
                onFocus={() => props.setValidLogin(true)}
            />
            <FormInput
                type="password"
                label="Password"
                placeholder="Your password"
                value={props.password}
                onChange={(event) => props.handleChange(event)}
            />
            <a onClick={() => props.setFormStatus("resetPassword")} href="#">
                Forgot password?
            </a>
            <input
                className="button submit-button"
                onClick={() => props.handleSubmit()}
                name="submit"
                type="button"
                value="Login"
            />
        </form>
    );
}

export default LoginForm;
