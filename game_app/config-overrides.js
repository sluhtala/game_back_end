/* config-overrides.js */
const path = require("path");

const multipleEntry = require("react-app-rewire-multiple-entry")([
    {
        entry: "src/index.js",
        template: "public/index.html",
        outPath: "/index.html",
    },
    {
        entry: "src/game_entry.js",
        template: "public/index.html",
        outPath: "/game.html",
    },
    {
        entry: "src/reset_passwordForm.js",
        template: "public/index.html",
        outPath: "/reset_password.html",
    },
]);

module.exports = {
    webpack: function (config, env) {
        multipleEntry.addMultiEntry(config);
        return config;
    },
};
