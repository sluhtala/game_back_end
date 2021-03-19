const mysql = require("mysql2");
const fs = require("fs");

//NOTE! mysql server needs to be running and
//mysql_init_db_opts needs to be root

const file = fs.readFileSync("resources/mysql_init_db_opts.json");
if (!file) console.log("Error: No opts mysq_init_db_opts.json file found");
const opts = JSON.parse(file);

const connection = mysql.createConnection(opts);

connection.connect((error) => {
    if (error) console.log(error.stack);
});

const create_db = "CREATE DATABASE game_db";
connection.query(create_db, (error, result) => {
    if (error) console.log(error);
    console.log("Database game_db created");
});

connection.query("USE game_db", (error) => {
    if (error) console.log(error);
});

const create_users_table =
    "CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, email VARCHAR(255), password VARCHAR(255) NOT NULL, status ENUM('online','offline','sleep') NOT NULL, randomId VARCHAR(128));";
connection.query(create_users_table, (error, result) => {
    if (error) console.log(error);
    console.log("Table users created");
});

const create_friends_table =
    "CREATE TABLE friends(id INT AUTO_INCREMENT PRIMARY KEY, id_1 INT NOT NULL, id_2 INT NOT NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP);";
connection.query(create_friends_table, (error, result) => {
    if (error) console.log(error);
    console.log("Table friends created");
});

const create_user =
    "CREATE USER 'client'@'" + opts.host + "' IDENTIFIED BY 'Game42PS!Client';";
connection.query(create_user, (error, result) => {
    if (error) console.log(error);
    console.log("Client user created");
});

const user_privileges =
    "GRANT INSERT, DELETE, SELECT, UPDATE ON game_db.* to 'client'@'" +
    opts.host +
    "';";

connection.query(user_privileges, (error, result) => {
    if (error) console.log(error);
    console.log("Client privileges set");
});

connection.query("FLUSH PRIVILEGES", (error, result) => {
    if (error) console.log(error);
});

connection.end();

//Creates hashing key -file for password storage
const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const secret_key = crypto.randomBytes(32);
fs.writeFileSync(
    "resources/encrypt_key.json",
    JSON.stringify({
        algorithm: algorithm,
        secret_key: secret_key,
    })
);
