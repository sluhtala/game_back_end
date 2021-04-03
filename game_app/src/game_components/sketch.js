import React from "react";
import p5 from "p5";

class OtherPlayers {
    constructor(p) {
        this.amount = 0;
        this.players = []; //{a: {x,y} b, c, color: rgb}
        this.p = p;
    }
    addPlayer(
        id,
        color = "rgba(255,0,0,1)",
        a = { x: 0, y: 0 },
        b = { x: 0, y: 0 },
        c = { x: 0, y: 0 },
        position = { x: 250, y: 250 },
        size = 10
    ) {
        let data = {
            id: id,
            color: color,
            a: a,
            b: b,
            c: c,
            messageTime: 0,
            message: "",
            position: position,
            size: size,
            isSpeaking: false,
        };
        this.players.push(data);
        this.amount = this.players.length;
    }
    removePlayer(id) {
        this.players.foreach((player, i) => {
            if (player.id === id) {
                this.players.splice(i, 1);
                return;
            }
        });
        this.amount = this.players.length;
    }

    draw() {
        this.p.strokeWeight(0);
        for (let i = 0; i < this.amount; i++) {
            if (!this.players[i]) return;
            this.p.fill(this.players[i].color);
            this.p.beginShape(this.p.TRIANGLES);
            this.p.vertex(this.players[i].a.x, this.players[i].a.y);
            this.p.vertex(this.players[i].b.x, this.players[i].b.y);
            this.p.vertex(this.players[i].c.x, this.players[i].c.y);
            this.p.endShape(this.p.CLOSE);
            if (this.players[i].isSpeaking) {
                this.p.textSize(24);
                let textx = this.players[i].position.x;
                let texty = this.players[i].position.y - this.players[i].size;
                this.p.text(this.players[i].message, textx, texty);
                if (this.p.millis() - this.players[i].messageTime > 4000)
                    this.players[i].isSpeaking = false;
            }
        }
    }

    speak(message, id) {
        let player = this.players.find((player) => {
            return player.id === id;
        });
        if (player.isSpeaking) return 0;
        player.isSpeaking = true;
        player.message = message;
        player.messageTime = this.p.millis();
        return 1;
    }
}

class Player {
    constructor(color, p) {
        this.color = color;
        this.position = p.createVector(250, 250);
        this.speed = 2;
        this.size = 10;
        this.angle = 10;
        this.turn_speed = 5;
        this.isSpeaking = false;
        this.messageTime = 0;
        this.a = p.createVector(0, 0);
        this.b = p.createVector(0, 0);
        this.c = p.createVector(0, 0);
    }

    draw(p) {
        this.a = p.createVector(
            p.sin(p.radians(this.angle)) * this.size,
            -p.cos(p.radians(this.angle)) * this.size
        );
        this.b = p.createVector(
            p.sin(p.radians(this.angle + 140)) * this.size,
            -p.cos(p.radians(this.angle + 140)) * this.size
        );
        this.c = p.createVector(
            p.sin(p.radians(this.angle + 220)) * this.size,
            -p.cos(p.radians(this.angle + 220)) * this.size
        );

        this.a.add(this.position);
        this.b.add(this.position);
        this.c.add(this.position);
        p.fill(this.color);
        p.strokeWeight(1);
        p.stroke(255);

        p.beginShape(p.TRIANGLES);
        p.vertex(this.a.x, this.a.y);
        p.vertex(this.b.x, this.b.y);
        p.vertex(this.c.x, this.c.y);
        p.endShape(p.CLOSE);
        p.strokeWeight(0);
        if (this.isSpeaking) {
            p.textSize(24);
            let textx = this.position.x;
            let texty = this.position.y - this.size;
            p.text(this.message, textx, texty);
            if (p.millis() - this.messageTime > 4000) this.isSpeaking = false;
        }
    }
    update(p) {
        let movevec = p.createVector(0, 0);
        if (p.keyIsDown(87) && this.position.y >= 0 + this.size) movevec.y -= 1;
        if (p.keyIsDown(83) && this.position.y < 500 - this.size)
            movevec.y += 1;
        if (p.keyIsDown(65) && this.position.x >= 0 + this.size) movevec.x -= 1;
        if (p.keyIsDown(68) && this.position.x < 500 - this.size)
            movevec.x += 1;
        let mag = p.sqrt(movevec.x * movevec.x + movevec.y * movevec.y);
        if (mag === 0) return;

        movevec.x = (movevec.x / mag) * this.speed;
        movevec.y = (movevec.y / mag) * this.speed;
        let new_angle = p.degrees(
            p.acos(movevec.dot(p.createVector(0, -1)) / this.speed)
        );
        if (movevec.x < 0) {
            new_angle = 360 - new_angle;
        }
        new_angle = new_angle - this.angle;
        if (new_angle < 0 && p.abs(new_angle) > 180) new_angle += 360;
        if (new_angle > 0 && p.abs(new_angle) > 180) new_angle -= 360;
        if (new_angle !== 0) {
            this.angle += (new_angle / p.abs(new_angle)) * this.turn_speed;
        }
        if (this.angle >= 360) this.angle = 0;
        if (this.angle < 0) this.angle = 360 + this.angle;
        this.position.add(movevec);
    }
    speak(message, p) {
        if (this.isSpeaking) return 0;
        this.isSpeaking = true;
        this.message = message;
        this.messageTime = p.millis();
        return 1;
    }
}

function submitMsg(p, message) {
    return player.speak(message, p);
}

let player;
let otherPlayers;

class Sketch extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    Sketch_init = (p) => {
        p.setup = () => {
            p.createCanvas(500, 500);
            p.background(220);
            let c = p.color(255, 0, 0);
            player = new Player(c, p);
            otherPlayers = new OtherPlayers(p);
        };

        p.draw = () => {
            p.background(220);
            if (this.props.color) {
                let col = this.props.color;
                player.color = p.color(col[0], col[1], col[2]);
            }
            if (this.props.enable && p.keyIsPressed && p.key === "t")
                this.props.useChat();
            if (p.keyIsPressed && this.props.enable) {
                player.update(p);
                let data = {
                    id: this.props.socket.id,
                    color: player.color.toString(),
                    a: { x: player.a.x, y: player.a.y },
                    b: { x: player.b.x, y: player.b.y },
                    c: { x: player.c.x, y: player.c.y },
                    position: { x: player.position.x, y: player.position.y },
                    size: player.size,
                    isSpeaking: player.isSpeaking,
                };
                this.props.socket.emit("playerMove", data);
            }
            if (this.props.message && this.props.message.length > 0) {
                if (submitMsg(p, this.props.message)) {
                    this.props.socket.emit("message", {
                        message: this.props.message,
                    });
                    this.props.messageSent();
                }
            }
            otherPlayers.draw();
            player.draw(p);
        };

        this.props.socket.on("connect", () => {
            console.log("connected");
            player.draw(p);
            let data = {
                id: this.props.socket.id,
                color: player.color.toString(),
                a: { x: player.a.x, y: player.a.y },
                b: { x: player.b.x, y: player.b.y },
                c: { x: player.c.x, y: player.c.y },
                position: { x: player.position.x, y: player.position.y },
                size: player.size,
                isSpeaking: player.isSpeaking,
            };
            console.log("hello");
            this.props.socket.emit("playerConnected", data);
            console.log(this.props.socket);
        });

        this.props.socket.on("createOtherPlayers", (data) => {
            console.log("creating existing players");
            if (!data) return;
            if (this.props.socket.id !== data.id) return;
            console.log("creating existing players");
            for (let i = 0; i < data.players.length; i++) {
                otherPlayers.addPlayer(
                    data.players[i].id,
                    data.players[i].color,
                    data.players[i].a,
                    data.players[i].b,
                    data.players[i].c,
                    data.players[i].position,
                    data.players[i].size
                );
            }
        });

        this.props.socket.on("addNewPlayer", (data) => {
            otherPlayers.addPlayer(data.id, data.color, data.a, data.b, data.c);
            console.log("added new player");
        });
        this.props.socket.on("playerLeft", (data) => {
            otherPlayers.removePlayer(data.id);
            console.log("player left");
        });
        this.props.socket.on("moveOtherPlayers", (data) => {
            otherPlayers.players.foreach((player) => {
                if (!player) return;
                if (player.id === data.id) {
                    player.color = data.color;
                    player.a = data.a;
                    player.b = data.b;
                    player.c = data.c;
                    player.position = data.position;
                    player.size = data.size;
                    player.isSpeaking = data.isSpeaking;
                }
            });
        });
        this.props.socket.on("messageSent", (data) => {
            otherPlayers.speak(data.message, data.id);
        });
    };
    componentDidMount() {
        this.myP5 = new p5(this.Sketch_init, this.myRef.current);
    }
    render() {
        return <div ref={this.myRef} className="p5-sketch"></div>;
    }
}

export default Sketch;
