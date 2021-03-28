const mysql = require("mysql2");
const fs = require("fs");
const crypto = require("crypto");

const sql_opts = {
    host: "localhost",
    user: "client",
    password: "Game42PS!Client",
    database: "game_db",
};

const connection = mysql.createConnection(sql_opts);

//new_user({ username: "hemuli", password: "taneli" });

function new_query(query, userData) {
    const timeout = 4000;
    return new Promise((resolve, reject) => {
        connection.query(query, userData, (error, results, fields) => {
            if (error) {
                fs.appendFile(
                    "resources/error_log.txt",
                    JSON.stringify(error) + "\n",
                    (err) => {
                        if (err) throw err;
                        console.log("Error log updated");
                    }
                );
                return reject(error);
            }
            resolve(results);
        });
    });
}

exports.new_query = new_query;
