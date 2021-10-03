import { Body } from "matter";

import LaserGroup from '../Classes/LaserGroup';
import TurretLaserGroup from '../Classes/TurretLaserGroup';


export default class FirstScene extends Phaser.Scene {

    spaceTile: Phaser.GameObjects.TileSprite;
    boundingBoxGraphic: Phaser.GameObjects.Graphics;
    turretGroup: Phaser.Physics.Arcade.Group;
    levelValue: number;
    scoreValue: number;
    shipHeartHealth1: number;
    shipHeartHealth2: number;
    shipHeartHealth3: number;
    shipHeartHealth4: number;
    gameOverRect: Phaser.Geom.Rectangle;
    gameOverBg: Phaser.GameObjects.Graphics;
    gameOver: boolean;
    isFiring: boolean;
    shipStatus: string;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    heart1: Phaser.GameObjects.Sprite;
    heart2: Phaser.GameObjects.Sprite;
    heart3: Phaser.GameObjects.Sprite;
    heart4: Phaser.GameObjects.Sprite;

    ship: Phaser.GameObjects.Image;
    thruster: Phaser.GameObjects.Sprite;
    shipContainer: Phaser.GameObjects.Container;
    scoreTextLabel: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    levelTextLabel: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;
    laserTurretCollider: Phaser.Physics.Arcade.Collider;
    turretShipCollider: Phaser.Physics.Arcade.Collider;
    laser: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    laserSound: Phaser.Sound.BaseSound;
    camera: Phaser.Cameras.Scene2D.Camera;
    music: Phaser.Sound.BaseSound;
    inputKeys: Phaser.Input.Keyboard.Key[];
    laserGroup: LaserGroup;
    turretLaserGroup: TurretLaserGroup;

    constructor(config) {
        super(config);

        this.levelValue = 1;
        this.scoreValue = 0;
        this.shipStatus = 'a';
        this.isFiring = false;
    }

    preload() {

        //preload sprites
        this.load.image('space', 'assets/space.png');
        this.load.image('ship', 'assets/ship.png');

        //preload music
        this.load.audio('overview', 'assets/Space Heroes.ogg');
        this.load.audio('laser', 'assets/laser5.wav');
        this.load.audio('explode', 'assets/explode.mp3');
        this.load.audio('shiphit', 'assets/shiphit.wav');

        //load thruster sprites
        this.load.spritesheet('thrusters', 'assets/thrusters.png', { frameWidth: 15, frameHeight: 15 });

        //load projectile sprites
        this.load.spritesheet('projectiles', 'assets/projectiles.png', { frameWidth: 32, frameHeight: 32 });

        //load flying turret
        this.load.spritesheet('fturret', 'assets/flying-turret-spritesheet.png', { frameWidth: 49, frameHeight: 45 });

        //load explosion
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 45, frameHeight: 45 });

        //load hearts
        this.load.spritesheet('hearts', 'assets/hearts.png', { frameWidth: 17, frameHeight: 17 });

    }

    create() {

        this.inputKeys = [
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
		];

        //add the main camera
        this.camera = this.cameras.add();
        //add and play the main music
        this.music = this.sound.add('overview');
        //loop the music
        this.music.play({
            loop: true
        });

        //add space background image
        this.spaceTile = this.add.tileSprite(0, 0, this.camera.width, this.camera.height, 'space');
        this.spaceTile.setOrigin(0, 0);
        this.spaceTile.setScrollFactor(0);

        //add score
        this.scoreTextLabel = this.add.text(40, this.camera.height - 80, 'Score', { fontSize: '24px', color: '#fff' });
        this.scoreText = this.add.text(40, this.camera.height - 50, this.scoreValue.toString(), { fontSize: '20px', color: '#fff' });
        
        //display level
        this.levelTextLabel = this.add.text(this.camera.width - 150, this.camera.height - 80, 'Level', { fontSize: '24px', color: '#fff' });
        this.levelText = this.add.text(this.camera.width - 150, this.camera.height - 50, this.levelValue.toString(), { fontSize: '20px', color: '#fff' });

        //add bounding zone on map between ship and turrets
        this.boundingBoxGraphic = this.add.graphics({
            x: this.camera.width / 3,
            y: 0,
        });
        
        this.physics.add.existing(this.boundingBoxGraphic, true);
        if(this.boundingBoxGraphic.body instanceof Phaser.Physics.Arcade.StaticBody)
        {
            this.boundingBoxGraphic.body.setSize(100, this.camera.height);
            this.boundingBoxGraphic.body.setOffset(this.camera.width/2.5, 0);
        }

        //add world bounds listener
        this.physics.world.setBoundsCollision();

        //add thruster's animation
        this.anims.create({
            key: 'thrust',
            frames: this.anims.generateFrameNumbers('thrusters', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        //add laser's animation
        this.anims.create({
            key: 'laser',
            frames: this.anims.generateFrameNumbers('projectiles', { start: 1, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'turretLaser',
            frames: this.anims.generateFrameNumbers('projectiles', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        //add turrets animation
        this.anims.create({
            key: 'turret',
            frames: this.anims.generateFrameNumbers('fturret', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //add explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
            frameRate: 30,
            repeat: 0,
        });

        //add heart animations
        this.anims.create({
            key: 'heart-full',
            frames: this.anims.generateFrameNumbers('hearts', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'heart-three-quarter',
            frames: this.anims.generateFrameNumbers('hearts', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'heart-half',
            frames: this.anims.generateFrameNumbers('hearts', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'heart-quarter',
            frames: this.anims.generateFrameNumbers('hearts', { start: 3, end: 3 }),
            frameRate: 10,
            repeat: 0,
        });


        //add turrets to scene, frameQuantity is number to spawn
        var turretsToSpawn = this.levelValue * 2;
    
        this.turretGroup = this.physics.add.group({ key: 'fturret', frameQuantity: turretsToSpawn });
        this.physics.world.enable(this.turretGroup); //enable physics on the turretGroup

        Phaser.Actions.Call(this.turretGroup.getChildren(), turret => {
           
            if (turret.body instanceof Phaser.Physics.Arcade.Body) {

                turret.body.setVelocity(Phaser.Math.Between(100, 375), Phaser.Math.Between(200, 300)).setBounce(1, 1).setCollideWorldBounds(true);
                turret.body.setSize(25, 25);
            }

            if (turret instanceof Phaser.Physics.Arcade.Sprite) {
                //spawn the turrets offscreen and then have them move into frame
                turret.setY(-100);
                turret.setX(600);
            }

            //add collider to turrets and boundary box
            this.physics.add.collider(turret, this.boundingBoxGraphic, this.hitBoundingBox, null, this);
        },this);

        //create ship container
        this.ship = this.add.image(0, 0, 'ship');
        this.thruster = this.add.sprite(-25, 0, 'thrusters');

        //create laser and turret laser groups
        this.laserSound = this.sound.add('laser');

        this.laserGroup = new LaserGroup(this);
        this.turretLaserGroup = new TurretLaserGroup(this);


        this.shipContainer = this.add.container(100, 100, [this.ship, this.thruster]);
        this.shipContainer.setSize(25, 25);
        this.physics.world.enable(this.shipContainer); //enable physics on the shipContainer so we can move it around

        if(this.shipContainer.body instanceof Phaser.Physics.Arcade.Body){
            this.shipContainer.body.setCollideWorldBounds(true);
        }

        //add collider for ship with boundary box
        this.physics.add.collider(this.shipContainer, this.boundingBoxGraphic, null, null, this);

        this.heart1 = this.add.sprite(190, 40, 'heart1').setScale(2.5);
        this.heart2 = this.add.sprite(140, 40, 'heart2').setScale(2.5);
        this.heart3 = this.add.sprite(90, 40, 'heart3').setScale(2.5);
        this.heart4 = this.add.sprite(40, 40, 'heart4').setScale(2.5);

        //add ships's starting health TODO instead, add hearts as levels get harder or as a powerup
        if (this.levelValue == 1) {
            this.shipHeartHealth1 = 4;
            this.shipHeartHealth2 = 4;
            this.shipHeartHealth3 = 4;
            this.shipHeartHealth4 = 4;

            //add full heart indicators
            this.heart1.anims.play('heart-full');
            this.heart2.anims.play('heart-full');
            this.heart3.anims.play('heart-full');
            this.heart4.anims.play('heart-full');
        }
        else {
            // console.log(this.shipHeartHealth1, this.shipHeartHealth2, this.shipHeartHealth3, this.shipHeartHealth4);
            //animate remaining hearts
            if (this.shipHeartHealth1 === 4) {
                this.heart1.anims.play('heart-full');
            }
            else if (this.shipHeartHealth1 === 3) {
                this.heart1.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth1 === 2) {
                this.heart1.anims.play('heart-half');
            } else if (this.shipHeartHealth1 === 1) {
                this.heart1.anims.play('heart-quarter');
            } else {
                this.heart1.destroy();
            }

            //animate remaining hearts
            if (this.shipHeartHealth2 === 4) {
                this.heart2.anims.play('heart-full');
            }
            else if (this.shipHeartHealth2 === 3) {
                this.heart2.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth2 === 2) {
                this.heart2.anims.play('heart-half');
            } else if (this.shipHeartHealth2 === 1) {
                this.heart2.anims.play('heart-quarter');
            } else {
                this.heart2.destroy();
            }

            //animate remaining hearts
            if (this.shipHeartHealth3 === 4) {
                this.heart3.anims.play('heart-full');
            }
            else if (this.shipHeartHealth3 === 3) {
                this.heart3.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth3 === 2) {
                this.heart3.anims.play('heart-half');
            } else if (this.shipHeartHealth3 === 1) {
                this.heart3.anims.play('heart-quarter');
            } else {
                this.heart3.destroy();
            }

            //animate remaining hearts

            if (this.shipHeartHealth4 === 4) {
                this.heart4.anims.play('heart-full');
            }
            else if (this.shipHeartHealth4 === 3) {
                this.heart4.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth4 === 2) {
                this.heart4.anims.play('heart-half');
            } else if (this.shipHeartHealth4 === 1) {
                this.heart4.anims.play('heart-quarter');
            } else {
                this.heart4.destroy();
            }
        }


        //add cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();

        //create timers for the turret lasers
        this.time.addEvent({
            delay: 1200,
            callback: this.fireTurrets,
            callbackScope: this,
            loop: true
        });

        //set world bounds listener
        // this.physics.world.on('worldbounds', this.onWorldBounds);

        this.gameOverRect = new Phaser.Geom.Rectangle(0, 0, this.camera.width, this.camera.height);
        this.gameOverBg = this.add.graphics();
        this.gameOverBg.fillStyle(0x000000, 0);
        this.gameOverBg.fillRectShape(this.gameOverRect);
    }

    update() {

        if (this.gameOver) { //turrets win, show game over menu and restart scene

            if (this.shipStatus == 'd') {
                this.add.text(50, this.camera.height - 300, 'GAME OVER! Press the space key to play again.', {
                    fontSize: '32px',
                    color: '#fff'
                });

                if (this.cursors.space.isDown) {
                    this.gameOver = false;
                    this.levelValue = 1;
                    this.scoreValue = 0;
                    this.shipStatus = 'a'
                    this.scene.restart();
                }
            }
            else { //no more turrets, player wins, advance level and reset gameOver flag, reset scene

                this.gameOver = false;
                this.levelValue++;
                this.scene.restart();
            }

        }
        else { //continue animating the ship

            // Loop over all keys
            this.inputKeys.forEach(key => {
                // If key was just pressed down, shoot the laser. We use JustDown to make sure this only fires once.
                if (Phaser.Input.Keyboard.JustDown(key)) {
                    // console.log('firing')
                    this.shootLaser();
                }
            });
       
            if (this.cursors.up.isDown) {
                if (this.shipContainer.body instanceof Phaser.Physics.Arcade.Body) {
                    this.shipContainer.body.setVelocityY(-400);
                }
            } else if (this.cursors.down.isDown) {
                if (this.shipContainer.body instanceof Phaser.Physics.Arcade.Body) {
                    this.shipContainer.body.setVelocityY(400);
                }
            } else if (this.cursors.left.isDown) {
                if (this.shipContainer.body instanceof Phaser.Physics.Arcade.Body) {
                    this.shipContainer.body.setVelocityX(-400);
                }
            } else if (this.cursors.right.isDown) {
                if (this.shipContainer.body instanceof Phaser.Physics.Arcade.Body) {
                    this.shipContainer.body.setVelocityX(400);
                }
            } else {
                if (this.shipContainer.body instanceof Phaser.Physics.Arcade.Body) {
                    this.shipContainer.body.setVelocityY(0);
                    this.shipContainer.body.setVelocityX(0);
                }
            }

            //animate turrets
            Phaser.Actions.Call(this.turretGroup.getChildren(), turret => {
                if (turret instanceof Phaser.Physics.Arcade.Sprite) {
                    turret.anims.play('turret', true);
                }
            }, this);

            //animate the thruster
            this.thruster.anims.play('thrust', true);
            //animate the background based on the camera position/ship position
            this.spaceTile.tilePositionX += 5;
        }


    }

    shootLaser() {
        this.laserGroup.fireLaser(this.shipContainer.x + 20, this.shipContainer.y + 5);
        this.laserTurretCollider = this.physics.add.collider(this.laserGroup.getFirstDead(false), this.turretGroup, this.hitTurret, null, this);
        this.laserSound.play();
    }

    hitBoundingBox(enemy) {
        // console.log(enemy);
        if (enemy.body.touching.left) {
            enemy.body.velocity.x = 300;
        } else if (enemy.body.touching.right) {
            enemy.body.velocity.x = -300;
        } else if (enemy.body.touching.up) {
            enemy.body.velocity.y = 300;
        } else if (enemy.body.touching.down) {
            enemy.body.velocity.y = -300;
        }
    }

    //event when things go out of bounds, cleanup mostly
    // onWorldBounds(body) {
    //     console.log(body);
        
    //     body.gameObject.destroy();
    // }

    hitTurret(laser, turret) {
        this.scoreValue += 100; //turrets are worth 100 pts TODO make variable based on level(?)
        this.scoreText.setText(this.scoreValue.toString());

        var explodeSound = this.sound.add('explode');
        explodeSound.play();

        this.physics.world.removeCollider(this.laserTurretCollider);
        laser.setVelocityX(0);

        laser.anims.play('explode', true);
        turret.destroy(); //destroy turret

        //destroy the laser after animating
        laser.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            laser.destroy();
        })

        if (this.turretGroup.getChildren().length === 0) {
            this.gameOver = true; //game ends if we are out of turrets
        }
    }

    fireTurrets() {

        Phaser.Actions.Call(this.turretGroup.getChildren(), turret => {
            //add turret laser fire
            if (turret instanceof Phaser.Physics.Arcade.Sprite) {

                this.turretLaserGroup.fireLaser(turret.x + 20, turret.y);
                this.laserTurretCollider = this.physics.add.collider(this.turretLaserGroup.getFirstDead(false), this.shipContainer, this.hitShip, null, this);
                // this.turretShipCollider = this.physics.add.collider(turretLaser, this.shipContainer, this.hitShip, null, this);

                
                // const turretLaser = this.physics.add.sprite(turret.x, turret.y, 'turretLaser');
                // turretLaser.anims.play('turretLaser');
                // turretLaser.body.setVelocityX(-550);
                // turretLaser.body.setCollideWorldBounds(true, 1, 1, true);

                // //add collider for laser with turretGroup
            }
        }, this);
    }

    hitShip(turretLaser, shipContainer) {

        var shipHitSound = this.sound.add('shiphit');
        shipHitSound.play();

        turretLaser.body.setVelocityX(0);

        turretLaser.anims.play('explode', true);
        turretLaser.body.destroy();

        this.physics.world.removeCollider(this.turretShipCollider);

        this.shipStatus = this.shipLifeHandler();

        if (this.shipStatus == 'd') {
            shipContainer.destroy();
            this.gameOver = true;
        }
    }

    shipLifeHandler() {

        if (this.shipHeartHealth1 !== 0) {

            this.shipHeartHealth1--; //decrease this heart

            //animate this heart
            if (this.shipHeartHealth1 === 3) {
                this.heart1.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth1 === 2) {
                this.heart1.anims.play('heart-half');
            } else if (this.shipHeartHealth1 === 1) {
                this.heart1.anims.play('heart-quarter');
            } else if (this.shipHeartHealth1 === 0) {
                this.heart1.destroy();
            }

            return 'a';
        }
        else if (this.shipHeartHealth2 !== 0) {

            this.shipHeartHealth2--; //decrease this heart

            //animate this heart
            if (this.shipHeartHealth2 === 3) {
                this.heart2.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth2 === 2) {
                this.heart2.anims.play('heart-half');
            } else if (this.shipHeartHealth2 === 1) {
                this.heart2.anims.play('heart-quarter');
            } else if (this.shipHeartHealth2 === 0) {
                this.heart2.destroy();
            }

            return 'a';
        }
        else if (this.shipHeartHealth3 !== 0) {

            this.shipHeartHealth3--; //decrease this heart

            //animate this heart
            if (this.shipHeartHealth3 === 3) {
                this.heart3.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth3 === 2) {
                this.heart3.anims.play('heart-half');
            } else if (this.shipHeartHealth3 === 1) {
                this.heart3.anims.play('heart-quarter');
            } else if (this.shipHeartHealth3 === 0) {
                this.heart3.destroy();
            }

            return 'a';
        }
        else {

            this.shipHeartHealth4--; //decrease this heart

            //animate this heart
            if (this.shipHeartHealth4 === 3) {
                this.heart4.anims.play('heart-three-quarter');
            } else if (this.shipHeartHealth4 === 2) {
                this.heart4.anims.play('heart-half');
            } else if (this.shipHeartHealth4 === 1) {
                this.heart4.anims.play('heart-quarter');
            } else if (this.shipHeartHealth4 === 0) {
                this.heart4.destroy();
                return 'd'; //signal we are out of hearts
            }

            return 'a';
        }
    }
}