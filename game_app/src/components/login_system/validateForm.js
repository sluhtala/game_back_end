function validateForm(setFormWarning, setValidForm, inputs) {
    const upattern = /^[\s;='}{@#$%^]$/;
    const epattern = /^[.\w-]+@[\w-]+\.[\w-]{2,}$/;
    const ppattern = /\s/;
    if (inputs.username === "" || upattern.test(inputs.username)) {
        setValidForm(false);
        setFormWarning("Invalid username.");
        return false;
    }
    if (inputs.email === "" || !epattern.test(inputs.email)) {
        setValidForm(false);
        setFormWarning("Invalid email.");
        return false;
    }
    if (inputs.password === "" || ppattern.test(inputs.password)) {
        setValidForm(false);
        setFormWarning("Invalid password.");
        return false;
    }
    if (inputs.password !== inputs.confirmpassword) {
        setValidForm(false);
        setFormWarning("Password doesn't match.");
        return false;
    }
    return true;
}

exports.validateForm = validateForm;
