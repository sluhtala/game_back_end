const { unhash_password, hash_password } = require("./encryption");
const { new_query } = require("./databaseHandle");
const crypto = require("crypto");
const { rejects } = require("assert");

exports.create_randomId = function () {
    return new Promise((resolve, rejects) =>
        resolve(crypto.randomBytes(8).toString("hex"))
    );
};

exports.login_update = async function (username, randomid) {
    try {
        await new_query(
            `UPDATE users SET randomId='${randomid}', status='online', lastLogin=Now() WHERE username='${username}'`
        );
    } catch (e) {
        console.error(e);
    }
};

exports.logout_update = async function (username) {
    try {
        await new_query(
            `UPDATE users SET randomId='' WHERE username='${username}'`
        );
        await new_query(
            `UPDATE users SET status='offline' WHERE username='${username}'`
        );
    } catch (e) {
        console.error(e);
    }
};

function compare_passwords(user, password) {
    return new Promise((resolve, rejects) => {
        new_query(
            `SELECT username, password FROM users WHERE username='${user}'`
        )
            .then((qresult) => {
                if (qresult.length == 0) {
                    console.log("invalid username");
                    resolve(2);
                }
                let attempt = hash_password(password);
                let stored = qresult[0].password;
                if (attempt !== stored) resolve(2);
                else resolve(1);
            })
            .catch((err) => rejects(err));
    });
}

exports.compare_passwords = compare_passwords;
