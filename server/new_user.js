const { new_query } = require("./databaseHandle");
const { hash_password } = require("./encryption");
const { send_confirm_email } = require("./email_handler");
const crypto = require("crypto");

function validate_form(form) {
    if (!form || !form.username || !form.password || !form.email) return false;
    const upattern = /^[\s;='}{@#$%^]$/;
    if (upattern.test(form.username)) return false;
    const epattern = /^[.\w-]+@[\w-]+\.[\w-]{2,}$/;
    if (!epattern.test(form.email)) return false;
    const ppattern = /\s/;
    if (ppattern.test(form.password)) return false;
    return true;
}

async function new_user(user) {
    let encrypted = hash_password(user.password);
    const validatesql = `SELECT username FROM users where username='${user.username}' OR email='${user.email}';`;
    const sql = `INSERT INTO users (username, email, password, status) VALUES('${user.username}','${user.email}','${encrypted}', 'disabled');`;
    try {
        let result = await new_query(validatesql);
        if (result.length > 0) return false;
        else {
            let res = await new_query(sql);
            send_confirm_email(user.email, user, res.insertId);
            //await new_query("delete from users where id>=29;"); // just testing stuff
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function confirm_user(body) {
    const sql = `SELECT id FROM users WHERE username='${body.user}'`;
    const updatesql = `UPDATE users SET status='offline' WHERE username='${body.user}'`;

    try {
        let urlcheck = await new_query(sql);
        let test = crypto.createHash("sha1");
        test.update(`${urlcheck[0].id}${body.user}`);
        if (test.digest("hex") === body.hash) {
            await new_query(updatesql);
            return { ok: true };
        }
    } catch (e) {
        console.error(e);
    }
}

async function delete_user(user) {
    const sql = `DELETE FROM users where username='${user.username}' AND randomId='${user.randomId}'`;
}

async function check_name(name) {
    let res = false;
    let result;
    try {
        result = await new_query(
            `SELECT username FROM users WHERE username='${name}'`
        );
    } catch {
        (e) => console.error(e);
    }
    if (result.length > 0) res = true;
    return res;
}

exports.check_name = check_name;
exports.new_user = new_user;
exports.validate_form = validate_form;
exports.confirm_user = confirm_user;
