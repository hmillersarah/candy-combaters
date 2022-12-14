// Sprite class
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        // How many frames we have elapsed over
        this.framesElapsed = 0;
        // How many frames till framesCurrent changes (slow down animation)
        // Ex: If framesHolde = 10, for every 10th frame, we loop through the animation
        // The smaller the value, the faster the animation
        this.framesHold = 20;
        // Offset image to override padding
        this.offset = offset;
    }

    // Sets image crop region and actual image dimensions
    draw() {
        c.drawImage(
            this.image, 
            // Crop image x, y, width, and height
            // X-coordinate moves crop mark
            // EX: 0 * 200 = 0 -> Crop region does not move
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // Image x, y, width, and height
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        );
    }

    // Change current frame in crop region
    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            // Increases framesCurrent until it reaches framesMax, then animation resets
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    // Creates loop animation
    update() {
        this.draw();
        // Continuously increases
        this.animateFrames();
    }
}

//Fighter class
class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0},
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined}
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity;
        // Stores lass pressed key
        this.lastKey;
        this.height = 150;
        // Same functionality as sprite class
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        // All sprite actions of fighter
        this.sprites = sprites;
        this.dead = false;
        // Attack target detection box
        this.attackBox = {
            position: {
              x: this.position.x,
              y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        },
        this.isAttacking;
        this.health = 100;

        // Loop through all sprites and sets sprite PNG to action
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
  
    // Update character position
    update() {
        this.draw();
        // Continue animating if the player has not died
        if (!this.dead) {
            this.animateFrames();
        }

        // Update position when a player moves
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // Gravity function
        // Keeps player on ground of canvas
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 345;
        } else {
            this.velocity.y += gravity;
        }
    }
  
    // Switch to attack sprite
    attack() {
      this.switchSprite('attack1')
      this.isAttacking = true
    }
  
    // Reduce health and switch to takeHit sprite
    takeHit() {
      this.health -= 20
  
      if (this.health <= 0) {
        this.switchSprite('death')
      } else this.switchSprite('takeHit')
    }
  
    // Switch case to update current sprite animation
    switchSprite(sprite) {
    // Overriding all other animations if fighter dies
      if (this.image === this.sprites.death.image) {
        if (this.framesCurrent === this.sprites.death.framesMax - 1)
          this.dead = true
        return
      }
  
      // Overriding all other animations with the attack animation
      if (
        this.image === this.sprites.attack1.image &&
        this.framesCurrent < this.sprites.attack1.framesMax - 1
      )
        return
  
      // Overriding all other animations when fighter is hit
      if (
        this.image === this.sprites.takeHit.image &&
        this.framesCurrent < this.sprites.takeHit.framesMax - 1
      )
        return
  
      switch (sprite) {
        case 'idle':
          if (this.image !== this.sprites.idle.image) {
            this.image = this.sprites.idle.image
            this.framesMax = this.sprites.idle.framesMax
            this.framesCurrent = 0
          }
          break
        case 'run':
          if (this.image !== this.sprites.run.image) {
            this.image = this.sprites.run.image
            this.framesMax = this.sprites.run.framesMax
            this.framesCurrent = 0
          }
          break
        case 'jump':
          if (this.image !== this.sprites.jump.image) {
            this.image = this.sprites.jump.image
            this.framesMax = this.sprites.jump.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'fall':
          if (this.image !== this.sprites.fall.image) {
            this.image = this.sprites.fall.image
            this.framesMax = this.sprites.fall.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'attack1':
          if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image
            this.framesMax = this.sprites.attack1.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'takeHit':
          if (this.image !== this.sprites.takeHit.image) {
            this.image = this.sprites.takeHit.image
            this.framesMax = this.sprites.takeHit.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'death':
          if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image
            this.framesMax = this.sprites.death.framesMax
            this.framesCurrent = 0
          }
          break
      }
    }
  }