const nodemailer = require("nodemailer");
const fs = require("fs");
const crypto = require("crypto");

const file = fs.readFileSync("./resources/email_config.json");
const opts = JSON.parse(file);

function create_message(hostname, to, username, id) {
    const hash = crypto.createHash("sha1");
    hash.update(`${id}${username}`);
    const link = `${hostname}/confirmUser?user=${username}&hash=${hash.digest(
        "hex"
    )}`;
    let message = {
        from: opts.options.auth.user,
        //to: to,
        to: "sluhtala@me.com",
        subject: "New user create",
        text: "",
        html: `<h3>New user created</h3><p>Welcome ${username}</p>
		<br>Click the link to confirm user creation.<a href="${link}">${link}</a>`,
    };
    return message;
}

const send_confirm_email = function (hostname, address_to, user, id) {
    let transporter = nodemailer.createTransport(opts.options);

    let message = create_message(hostname, address_to, user.username, id);
    transporter.sendMail(message, (err, info) => {
        if (err) console.log(err);
    });
};

const send_resetPassword_email = function (
    hostname,
    address_to,
    username,
    id,
    lastLogin
) {
    console.log("hello");
    let transporter = nodemailer.createTransport(opts.options);
    let hash = crypto.createHash("sha1");
    hash.update(`${id}${username}${lastLogin}`);
    let key = hash.digest("hex");
    let link = `${hostname}/resetPasswordForm?user=${username}&key=${key}`;

    let message = {
        from: opts.options.auth.user,
        //to: address_to,
        to: "sluhtala@me.com",
        subject: `Password reset for the user ${username}`,
        text: "",
        html: `<h3>Reset your password following the link</h3>
		<a href="${link}">${link}</a>`,
    };
    console.log(message);
    let ok = false;
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.error(err);
        } else ok = true;
    });
    return true;
};

exports.send_confirm_email = send_confirm_email;
exports.send_resetPassword_email = send_resetPassword_email;
