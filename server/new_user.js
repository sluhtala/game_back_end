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

async function new_user(user, hostname) {
    let encrypted = hash_password(user.password);
    const validatesql = `SELECT username FROM users where username=? OR email=?;`;
    const sql = `INSERT INTO users (username, email, password, status) VALUES(?,?,?,?);`;
    try {
        let result = await new_query(validatesql, [user.username, user.email]);
        if (result.length > 0) return false;
        else {
            let res = await new_query(sql, [
                user.username,
                user.email,
                encrypted,
                "disabled",
            ]);
            send_confirm_email(hostname, user.email, user, res.insertId);
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function confirm_user(body) {
    const sql = `SELECT id FROM users WHERE username=?`;
    const updatesql = `UPDATE users SET status='offline' WHERE username=?`;

    try {
        let urlcheck = await new_query(sql, [body.user]);
        let test = crypto.createHash("sha1");
        test.update(`${urlcheck[0].id}${body.user}`);
        if (test.digest("hex") === body.hash) {
            await new_query(updatesql, [body.user]);
            return { ok: true };
        }
    } catch (e) {
        console.error(e);
    }
}

async function delete_user(user) {
    const sql = `DELETE FROM users where username=? AND randomId=?`;
    try {
        await new_query(sql, [user.username, user.randomId]);
        return { ok: true };
    } catch (e) {
        console.error(e);
        return { error: true };
    }
}

async function check_name(name) {
    let res = false;
    let result;
    try {
        result = await new_query(
            `SELECT username FROM users WHERE username=?`,
            [name]
        );
    } catch (e) {
        console.error(e);
    }
    if (result.length > 0) res = true;
    return res;
}

async function find_user_with_email(email) {
    let sql = `SELECT username, id, lastLogin FROM users WHERE email='${email}';`;
    let result;
    try {
        result = await new_query(sql);
    } catch (e) {
        console.error(e);
        return null;
    }
    if (result.length === 0) return null;
    else return result[0];
}

async function reset_password(body) {
    let sql = `SELECT username, id, lastLogin FROM users WHERE username='${body.user}'`;
    let result;
    try {
        result = await new_query(sql);
        console.log(result);
    } catch (e) {
        console.error(e);
        return { error: "sql error" };
    }
    let hash = crypto.createHash("sha1");
    hash.update(`${result[0].id}${body.user}${result[0].lastLogin}`);
    let new_key = hash.digest("hex");
    console.log(new_key);
    if (new_key !== body.key) return { error: "key" };
    let new_hashed = hash_password(body.newPassword);
    let updatepw_sql = `UPDATE users SET password='${new_hashed}' WHERE username='${body.user}'`;
    try {
        await new_query(updatepw_sql);
    } catch (e) {
        console.error(e);
        return { error: "sql error" };
    }
    return { ok: true };
}

exports.check_name = check_name;
exports.new_user = new_user;
exports.validate_form = validate_form;
exports.confirm_user = confirm_user;
exports.reset_password = reset_password;
exports.find_user_with_email = find_user_with_email;
exports.delete_user = delete_user;
