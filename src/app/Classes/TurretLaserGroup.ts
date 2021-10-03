export default class TurretLaserGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);
 
		// Initialize the group
		this.createMultiple({
			classType: TurretLaser, // This is the class we create just below
			frameQuantity: 30, // Create X number of instances in the pool
			active: false,
			visible: false,
			key: 'turretLaser'
		})
	}


    fireLaser(x, y) {
		// Get the first available sprite in the group
		const laser:TurretLaser = this.getFirstDead(false);
		if (laser) {
			laser.fire(x, y);
			laser.anims.play('turretLaser');

			// if(laser.body instanceof Phaser.Physics.Arcade.Body)
        	// 	laser.body.setCollideWorldBounds(true);
		}
	}
 
}

class TurretLaser extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'turretLaser');
	} 

    fire(x, y) {
		this.body.reset(x, y);
 
		this.setActive(true);
		this.setVisible(true);
  
		this.setVelocityX(-550);
	}

    preUpdate(time, delta) {
		super.preUpdate(time, delta);
 
		if (this.x <= 0 || this.y <= 0) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
}
 
