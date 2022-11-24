class Sprite {
    constructor({position, imageSrc, scale = 1, frameMax = 1}) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.frameElapsed = 0;
        this.frameCurrent = 0;
        this.frameHold = 5;
    }

    draw() {
        context.drawImage(
            this.image, 
            this.frameCurrent * this.image.width / this.frameMax,
            0,
            this.image.width / this.frameMax,
            this.image.height,
            this.position.x, 
            this.position.y, 
            (this.image.width / this.frameMax) * this.scale, 
            this.image.height * this.scale
        );
    }

    update() {
        this.draw();
        this.frameElapsed++;
        if (this.frameElapsed % this.frameHold == 0) {
            if (this.frameCurrent < this.frameMax - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }
}

class Fighter  {
    constructor({position, velocity, color, offset}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.lastKey;
        this.height = 150;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        };
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    // Builds character on canvas
    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Creates character attack box when attacking
        if (this.isAttacking) {
            context.fillStyle = 'green';
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    // Update character position
    update() {
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Keeps player on ground of canvas
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }
}