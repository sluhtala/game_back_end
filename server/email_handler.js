const nodemailer = require("nodemailer");
const fs = require("fs");
const crypto = require("crypto");

const file = fs.readFileSync("./resources/email_config.json");
const opts = JSON.parse(file);
let transporter = nodemailer.createTransport(opts.options);

function create_message(to, username, id) {
    const hash = crypto.createHash("sha1");
    hash.update(`${id}${username}`);
    const link = `localhost:3001/confirmUser?user=${username}&hash=${hash.digest(
        "hex"
    )}`;
    let message = {
        from: opts.options.auth.user,
        //to: to,
        to: "sluhtala@me.com",
        subject: "New user create",
        text: "",
        html: `<h3>New user created</h3><p>Welcome ${username}</p>
		<br>Click the link to confirm user creation.<a href="${link}">Confirm</a>`,
    };
    return message;
}

const send_confirm_email = function (address_to, user, id) {
    let message = create_message(address_to, user.username, id);
    transporter.sendMail(message, (err, info) => {
        if (err) console.log(err);
        else console.log(info);
    });
};

const send_resetPassword_email = function (address_to) {};

exports.send_confirm_email = send_confirm_email;
exports.send_resetPassword_email = send_resetPassword_email;
