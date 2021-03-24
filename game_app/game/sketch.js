class Player {
    constructor(color) {
        this.color = color;
        this.position = createVector(250, 250);
        this.speed = 2;
        this.size = 10;
        this.angle = 10;
        this.turn_speed = 5;
        this.isSpeaking = false;
        this.messageTime = 0;
    }

    draw() {
        let a = createVector(
            sin(radians(this.angle)) * this.size,
            -cos(radians(this.angle)) * this.size
        );
        let b = createVector(
            sin(radians(this.angle + 140)) * this.size,
            -cos(radians(this.angle + 140)) * this.size
        );
        let c = createVector(
            sin(radians(this.angle + 220)) * this.size,
            -cos(radians(this.angle + 220)) * this.size
        );

        a.add(this.position);
        b.add(this.position);
        c.add(this.position);
        fill(this.color);
        strokeWeight(0);

        beginShape(TRIANGLES);
        vertex(a.x, a.y);
        vertex(b.x, b.y);
        vertex(c.x, c.y);
        endShape(CLOSE);
        if (this.isSpeaking) {
            textSize(24);
            let textx = this.position.x;
            let texty = this.position.y - this.size;
            text(this.message, textx, texty);
            if (millis() - this.messageTime > 4000) this.isSpeaking = false;
        }
    }
    update() {
        let movevec = createVector(0, 0);
        if (keyIsDown(87)) movevec.y -= 1;
        if (keyIsDown(83)) movevec.y += 1;
        if (keyIsDown(65)) movevec.x -= 1;
        if (keyIsDown(68)) movevec.x += 1;
        let mag = sqrt(movevec.x * movevec.x + movevec.y * movevec.y);
        if (mag === 0) return;

        movevec.x = (movevec.x / mag) * this.speed;
        movevec.y = (movevec.y / mag) * this.speed;
        let new_angle = degrees(
            acos(movevec.dot(createVector(0, -1)) / this.speed)
        );
        if (movevec.x < 0) {
            new_angle = 360 - new_angle;
        }
        new_angle = new_angle - this.angle;
        if (new_angle < 0 && abs(new_angle) > 180) new_angle += 360;
        if (new_angle > 0 && abs(new_angle) > 180) new_angle -= 360;
        if (new_angle !== 0) {
            this.angle += (new_angle / abs(new_angle)) * this.turn_speed;
        }
        if (this.angle >= 360) this.angle = 0;
        if (this.angle < 0) this.angle = 360 + this.angle;
        this.position.add(movevec);
    }
    speak(message) {
        if (this.isSpeaking) return;
        this.isSpeaking = true;
        this.message = message;
        this.messageTime = millis();
    }
}

let inputtext;
function submitMsg() {
    p.speak(inputtext.value());
}

let button;
function setup() {
    createCanvas(500, 500);
    background(220);
    inputtext = createInput();
    button = createInput("Speak", "button");
    button.attribute("onClick", "submitMsg()");

    let c = color(255, 0, 0);
    p = new Player(c);
}
let p;

function draw() {
    background(220);
    p.draw();
    if (keyIsPressed) p.update();
}
