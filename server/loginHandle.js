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
            `UPDATE users SET randomId=?, status='online', last_login=Now() WHERE username=?`,
            [randomid, username]
        );
        await new_query(
            `INSERT INTO connections (user, randomId) VALUES ((SELECT id FROM users WHERE username=?), ?)`,
            [username, randomid]
        );
    } catch (e) {
        console.error(e);
    }
};

exports.logout_update = async function (username, randomid) {
    try {
        await new_query(
            `UPDATE users SET randomId='', status='offline' WHERE username=?`,
            [username]
        );
        await new_query(
            `DELETE FROM connections WHERE user=(SELECT id FROM users WHERE username=?) AND randomId=?;`,
            [username, randomid]
        );
        let otherconnections = await new_query(
            `SELECT id, randomId FROM connections WHERE user=((SELECT id FROM users WHERE username=?))`,
            [username]
        );
        if (otherconnections.length > 0) {
            await new_query(
                `UPDATE users SET status='online' WHERE username=?`,
                [username]
            );
        }
    } catch (e) {
        console.error(e);
    }
};

function compare_passwords(user, password) {
    return new Promise((resolve, rejects) => {
        new_query(
            `SELECT username, password, status FROM users WHERE username='${user}'`
        )
            .then((qresult) => {
                if (qresult.length == 0) {
                    console.log("invalid username");
                    resolve(2);
                }
                let attempt = hash_password(password);
                let stored = qresult[0].password;
                if (attempt !== stored) resolve(2);
                else if (qresult[0].status !== "disabled") resolve(1);
                else resolve(4);
            })
            .catch((err) => rejects(err));
    });
}

exports.compare_passwords = compare_passwords;
