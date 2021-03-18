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
]);

module.exports = {
    webpack: function (config, env) {
        multipleEntry.addMultiEntry(config);
        return config;
    },
};
