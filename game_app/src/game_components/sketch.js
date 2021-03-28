import React from "react";
import p5 from "p5";
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
    }

    draw(p) {
        let a = p.createVector(
            p.sin(p.radians(this.angle)) * this.size,
            -p.cos(p.radians(this.angle)) * this.size
        );
        let b = p.createVector(
            p.sin(p.radians(this.angle + 140)) * this.size,
            -p.cos(p.radians(this.angle + 140)) * this.size
        );
        let c = p.createVector(
            p.sin(p.radians(this.angle + 220)) * this.size,
            -p.cos(p.radians(this.angle + 220)) * this.size
        );

        a.add(this.position);
        b.add(this.position);
        c.add(this.position);
        p.fill(this.color);
        p.strokeWeight(0);

        p.beginShape(p.TRIANGLES);
        p.vertex(a.x, a.y);
        p.vertex(b.x, b.y);
        p.vertex(c.x, c.y);
        p.endShape(p.CLOSE);
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
        };

        p.draw = () => {
            p.background(220);
            if (this.props.color) {
                let col = this.props.color;
                player.color = p.color(col[0], col[1], col[2]);
            }
            player.draw(p);
            if (this.props.enable && p.keyIsPressed && p.key === "t")
                this.props.useChat();
            if (p.keyIsPressed && this.props.enable) player.update(p);
            if (this.props.message && this.props.message.length > 0) {
                if (submitMsg(p, this.props.message)) this.props.messageSent();
            }
        };
    };
    componentDidMount() {
        this.myP5 = new p5(this.Sketch_init, this.myRef.current);
    }
    render() {
        return <div ref={this.myRef} className="p5-sketch"></div>;
    }
}

export default Sketch;
