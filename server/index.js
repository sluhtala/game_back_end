const express = require("express");
const bodyParser = require("body-parser");
const { new_query } = require("./databaseHandle");
const app = express();
const {
    compare_passwords,
    create_randomId,
    login_update,
    logout_update,
} = require("./loginHandle");
const {
    check_name,
    validate_form,
    new_user,
    confirm_user,
    find_user_with_email,
    reset_password,
    delete_user,
} = require("./new_user.js");

const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public/build_slink/"));

app.get("/", (req, res) => {
    console.log("home");
    res.sendFile(__dirname + "/public/build_slink/index.html");
});

app.get("/game", (req, res) => {
    res.sendFile(__dirname + "/public/build_slink/game.html");
});

app.post("/login", (req, res) => {
    if (req.body.status === 0) {
        console.log(req.body);
        compare_passwords(req.body.username, req.body.password)
            .then((result) => {
                if (result === 2) {
                    //console.log("error invalid password");
                    res.send(JSON.stringify({ status: result }));
                    return 1;
                } else if (result === 1) {
                    //console.log("Password success");
                    create_randomId().then((id) => {
                        login_update(req.body.username, id);
                        res.send(
                            JSON.stringify({ status: result, randomId: id })
                        );
                    });
                }
            })
            .catch((e) => res.send(JSON.stringify({ status: 3 })));
    } else if (req.body.status === 1) {
        res.redirect(301, "/game");
    }
});

app.post("/logout", (req, res) => {
    //console.log(req.body);
    logout_update(req.body.username);
    res.redirect(301, "/");
});
app.post("/nameCheck", (req, res) => {
    let username = req.body.username;
    check_name(username).then((result) => {
        if (result === true) res.send(JSON.stringify({ result: false }));
        else res.send(JSON.stringify({ result: true }));
    });
});

app.post("/newUser", (req, res) => {
    const isValid = validate_form(req.body);
    if (isValid === false) {
        res.send(JSON.stringify({ isValid: false }));
        return;
    } else {
        new_user(req.body, req.hostname + ":" + PORT)
            .then((ret) => {
                let data = {};
                if (ret == true) {
                    data.isValid = true;
                } else data.isValid = false;
                res.send(JSON.stringify(data));
            })
            .catch((e) => {
                console.error(e);
                res.sendStatus(500);
            });
    }
});

const crypto = require("crypto");
const { send } = require("process");
const { send_resetPassword_email } = require("./email_handler");
const { request } = require("http");
app.get("/confirmUser", (req, res) => {
    if (!req.query || !req.query.hash || !req.query.user) {
        res.sendStatus(404);
        console.log("error confirming user");
    } else {
        confirm_user(req.query)
            .then((result) => {
                if (result.ok) {
                    res.sendFile(__dirname + "/public/register_success.html");
                }
            })
            .catch((e) => {
                console.error(e);
                res.sendStatus(501);
                res.send("error");
            });
    }
});

app.post("/resetPassword", (req, res) => {
    console.log(req.body);
    //req.body.user req.body.password

    // set new password in db
    // redir to home
    reset_password(req.body).then((result) => {
        if (result.ok) {
            res.redirect("/");
            console.log("ok");
        } else {
            res.send({ error: result });
            console.log("error");
        }
    });
});

app.get("/resetPasswordForm", (req, res) => {
    //localhost:3001?user=malmana&key:234234
    //check valid key
    if (!req.query.user || !req.query.key) {
        res.sendStatus(404);
    } else {
        //resetpassword
        res.sendFile(__dirname + "/public/build_slink/reset_password.html");
    }
});

app.post("/resetPasswordEmail", (req, res) => {
    const epattern = /^[.\w-]+@[\w-]+\.[\w-]{2,}$/;
    //check valid email format
    if (!req.body.email || !epattern.test(req.body.email)) {
        res.send({ error: "email" });
        return;
    }
    find_user_with_email(req.body.email).then((result) => {
        if (!result) {
            res.sendStatus(501);
            return;
        }
        console.log(result);
        if (!result.username) {
            res.send({ error: "user" });
            return;
        }
        let ok = send_resetPassword_email(
            req.hostname + ":" + PORT,
            req.body.email,
            result.username,
            result.id,
            result.lastLogin
        );
        if (ok) res.send({ ok: true });
    });
});

app.post("/deleteUser", (req, res) => {
    const data = req.body;
    delete_user(data)
        .then((ok) => {
            if (ok === true) res.send(JSON.stringify({ ok: true }));
            else res.send(JSON.stringify({ error: true }));
        })
        .catch((e) => {
            console.error(error);
        });
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
