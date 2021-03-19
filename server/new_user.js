const { new_query } = require("./databaseHandle");
const { hash_password } = require("./encryption");

function validate_form(form) {
    //if (!form || !form.username || !form.password || !form.email) return false;
    const upattern = /^[\s;='}{@#$%^]$/;
    //if (upattern.test(form.username)) return false;
    const epattern = /^[.\w-]+@[\w-]+\.[\w-]{2,}$/;
    if (!epattern.test(form.email)) return false;
    const ppattern = /\s/;
    if (ppattern.test(form.password)) return false;
    return true;
}

async function new_user(user) {
    let encrypted = hash_password(user.password);
    const sql = `INSERT INTO users (username, email, password, status) VALUES('${user.username}','${user.email}','${encrypted}', 'offline');`;
    try {
        await new_query(sql);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function delete_user(user) {}

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
