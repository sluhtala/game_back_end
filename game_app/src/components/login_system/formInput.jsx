import React from "react";

function FormInput(props) {
    return (
        <div className="login-form__input">
            <p className="form-text">{props.label + ":"}</p>
            <input
                pattern="^[A-Za-z]*$"
                name={props.label}
                type={props.type}
                autoComplete="off"
                value={props.value}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                onChange={props.onChange}
                placeholder={props.placeholder}
            />
        </div>
    );
}

export const FormInputRef = React.forwardRef((props, ref) => {
    return (
        <div className="login-form__input">
            <p className="form-text">{props.label + ":"}</p>
            <input
                ref={ref}
                pattern="^[A-Za-z]*$"
                name={props.label}
                type={props.type}
                autoComplete="off"
                value={props.value}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                onChange={props.onChange}
                placeholder={props.placeholder}
            />
        </div>
    );
});

export default FormInput;
