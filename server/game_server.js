const socket = require("socket.io");
let io;

const allPlayers = [];

const GameServer = {
    init: function (server) {
        io = socket(server);
    },
    serve: function () {
        io.on("connection", (socket) => {
            socket.on("playerConnected", (data) => {
                let newplayer = { ...data };
                socket.emit("createOtherPlayers", {
                    id: socket.id,
                    players: allPlayers,
                }); // emit sends to all client
                allPlayers.push(newplayer);
                socket.broadcast.emit("addNewPlayer", newplayer);
            });

            socket.on("message", (data) => {
                data.id = socket.id;
                console.log(data.message);
                socket.broadcast.emit("messageSent", data);
            });
            socket.on("playerMove", (data) => {
                let player = allPlayers.find((p) => p.id === socket.id);
                player.color = data.color;
                player.a = data.a;
                player.b = data.b;
                player.c = data.c;
                data.id = socket.id;
                socket.broadcast.emit("moveOtherPlayers", data);
            });
            socket.on("disconnect", () => {
                socket.broadcast.emit("playerLeft", { id: socket.id });
                allPlayers.map((player, i) => {
                    if (player.id === socket.id) allPlayers.splice(i, 1);
                });
            });
        });
    },
};

exports.GameServer = GameServer;
