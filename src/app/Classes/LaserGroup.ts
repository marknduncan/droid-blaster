export default class LaserGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);
 
		// Initialize the group
		this.createMultiple({
			classType: Laser, // This is the class we create just below
			frameQuantity: 50, // Create X number of instances in the pool
			active: false,
			visible: false,
			key: 'laser'
		})
	}


    fireLaser(x, y) {
		// Get the first available sprite in the group
		const laser:Laser = this.getFirstDead(false);
		if (laser) {
			laser.fire(x, y);
			laser.anims.play('laser');

			if(laser.body instanceof Phaser.Physics.Arcade.Body)
        		laser.body.setCollideWorldBounds(true, 1, 1, true);
		}
	}
 
}

class Laser extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'laser');
	} 

    fire(x, y) {
		this.body.reset(x, y);
 
		this.setActive(true);
		this.setVisible(true);
  
		this.setVelocityX(350);
	}

    preUpdate(time, delta) {
		super.preUpdate(time, delta);
 
		if (this.y <= 0) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
}
 
