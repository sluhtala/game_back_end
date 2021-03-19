const express = require("express");
const bodyParser = require("body-parser");
const { make_sql_query } = require("./databaseHandle");
const app = express();
const {
    compare_passwords,
    create_randomId,
    login_update,
    logout_update,
} = require("./loginHandle");

const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public/build_slink/"));

app.get("/hello", (req, res) => {
    res.send({ message: "connected" });
});

app.get("/game", (req, res) => {
    res.sendFile(__dirname + "/public/build_slink/game.html");
});

app.post("/login", (req, res) => {
    if (req.body.status === 0) {
        console.log(req.body);
        compare_passwords(req.body.username, req.body.password).then(
            (result) => {
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
            }
        );
    } else if (req.body.status === 1) {
        res.redirect(301, "/game");
    }
});

app.post("/logout", (req, res) => {
    //console.log(req.body);
    logout_update(req.body.username);
    res.redirect(301, "/");
});
const { check_name, validate_form, new_user } = require("./new_user.js");
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
        new_user(req.body)
            .then(() => {
                console.log("new_user created");
                let data = { isValid: true };
                res.send(JSON.stringify(data));
            })
            .catch((e) => {
                console.error(e);
                res.sendStatus(500);
            });
    }
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
