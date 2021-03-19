const crypto = require("crypto");
const fs = require("fs");

function unhash_password(hash) {
    const encryptdata = JSON.parse(
        fs.readFileSync("resources/encrypt_key.json")
    );
    let parts = hash.split(":");
    let iv = Buffer.from(parts.shift(), "hex");
    let encryptedText = Buffer.from(parts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
        encryptdata.algorithm,
        Buffer.from(encryptdata.secret_key, "hex"),
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function hash_password(password) {
    const encryptdata = JSON.parse(
        fs.readFileSync("resources/encrypt_key.json")
    );
    if (!encryptdata) return null;
    const key = encryptdata.secret_key;
    const algorithm = encryptdata.algorithm;
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

exports.unhash_password = unhash_password;
exports.hash_password = hash_password;
