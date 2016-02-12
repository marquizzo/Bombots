// Roboblasters notes:
// Hands-free mode: No hands allowed
// No-wheels mode: Cannot move 

pc.script.attribute("torque", "number", 40);

pc.script.create('bot', function (app) {
	// Creates a new Bot instance
	var Bot = function (entity) {
		// Robot parts
		this.entity		= entity;
		this.head		= null;
		this.torso		= null;
		this.sholdR		= null;
		this.sholdL		= null;
		this.hatchF		= null;
		this.hatchB		= null;
		this.wheelL		= null;
		this.wheelR		= null;
		this.ogBomb		= null;
		this.newBomb	= null;
		// Physics vars
		this.TIME_MULT	= 1;				// Time multiplier (for slo-mo)
		this.MAX_SPEED	= 0.05;				// Maximum speed
		this.ACCEL		= 0.001;			// Acceleration
		this.quatNow 	= new pc.Quat();	// Current angle
		this.quatTrg 	= new pc.Quat();	// Target angle
		this.rotAlpha	= 0;
		this.prevAngle	= 0;
		this.timeDelta	= 0;
		this.t 			= 0;
		this.velocity	= 0;
		this.moving		= false;
		// Tweens
		this.angles 	= {arms: 45, hatchF: 0, hatchB: 0, torso: 0, torsoLean: 0};
		this.twArms		= new TWEEN.Tween(this.angles);
		this.twHatchF	= new TWEEN.Tween(this.angles);
		this.twHatchB	= new TWEEN.Tween(this.angles);
		this.twTorso	= new TWEEN.Tween(this.angles);
		this.ezQI		= TWEEN.Easing.Quadratic.In;
		this.ezQO		= TWEEN.Easing.Quadratic.Out;
		this.ezQIO		= TWEEN.Easing.Quadratic.InOut;
		this.ezBO		= TWEEN.Easing.Back.Out;
	};

	Bot.prototype = {
		// Called once after all resources are loaded and before the first update
		initialize: function () {
			this.head		= this.entity.findByName("Head");
			this.torso		= this.entity.findByName("Torso");
			this.sholdR		= this.entity.findByName("ShoulderR");
			this.sholdL		= this.entity.findByName("ShoulderL");
			this.hatchF		= this.entity.findByName("HatchF");
			this.hatchB		= this.entity.findByName("HatchB");
			this.wheelL		= this.entity.findByName("WheelL");
			this.wheelR		= this.entity.findByName("WheelR");
			this.ogBomb		= app.root.findByName("Bomb");
			this.quatNow 	= this.entity.getRotation();
		},
		
		// Called every frame, dt is time in seconds since last update
		update: function (dt) {
			this.sholdL.setLocalEulerAngles(this.angles.arms, 0, 0);
			this.sholdR.setLocalEulerAngles(this.angles.arms, 0, 0);
			this.hatchF.setLocalEulerAngles(this.angles.hatchF, 0, 0);
			this.hatchB.setLocalEulerAngles(this.angles.hatchB, 0, 0);
			this.torso.setLocalEulerAngles(this.angles.torso + this.angles.torsoLean, 0, 0);
		},

		// Bot will move toward angle
		moveToAngle: function (yAngle, dt) {
			if(yAngle !== this.prevAngle){
				this.rotAlpha = 0;
				this.timeDelta = 0;
				this.prevAngle = yAngle;
			}

			// Turn toward angle
			if(this.rotAlpha < 0.5){
				this.quatTrg.setFromAxisAngle(pc.Vec3.UP, yAngle);

				this.timeDelta += (dt * this.TIME_MULT);
				this.rotAlpha = 1 - Math.pow((1 - this.timeDelta), 3);
				this.entity.setRotation(this.quatNow.slerp(this.quatNow, this.quatTrg, this.rotAlpha));
			}

			this.velocity += this.ACCEL;
			this.velocity = Math.min(this.velocity, this.MAX_SPEED);
			if(this.moving === false){
				this.moving = true;
				this.twTorso.to({torso: -10}, 200).easing(this.ezQO).start();
			}else if(this.velocity === this.MAX_SPEED && this.angles.torso === -10){
				this.twTorso.to({torso: 0}, 400).easing(this.ezQIO).start();
			}
			this.entity.translateLocal(0, 0, this.velocity);
			this.entity.rigidbody.syncEntityToBody();
		},

		decelerate: function (dt) {
			if(this.velocity === 0) return false;

			this.velocity -= this.ACCEL * 2;
			this.velocity = Math.max(this.velocity, 0);

			if(this.moving === true){
				this.moving = false;
				this.twTorso.to({torso: 10}, 200).easing(this.ezQO).start();
			}else if(this.velocity === 0){
				this.twTorso.to({torso: 0}, 200).easing(this.ezQIO).start();
			}

			this.entity.translateLocal(0, 0, this.velocity);
			this.entity.rigidbody.syncEntityToBody();
		},

		// Animates rotation
		updateRotation: function(dt){
			
			// When animation is over
			if(this.t >= 1){
				this.rotationComplete();
			}
		},
		
		// At the end of a rotation
		rotationComplete: function(){
			this.quatNow 	= this.entity.getRotation();
			this.frameCount = 0;
			this.t = 0;
		},

		btnA: function(){
			this.liftArms();
		},

		btnB: function(){
			if(this.moving === true){
				this.dropBombB();
			}else{
				this.dropBombF();
			}
		},

		reset: function(){
			this.prevAngle = 0;
			this.entity.rigidbody.teleport(0, 0.1, 0, 0, 0, 0);
		},

		liftArms: function(){
			if(this.sholdR.getLocalEulerAngles().x < 0){
				this.twArms.to({arms: 45, torsoLean: 0}, 250).easing(this.ezBO).start();
			}else{
				this.twArms.to({arms: -90, torsoLean: -10}, 300).easing(this.ezQIO).start();
			}
		},

		dropBombF: function(){
			if(this.hatchF.getLocalEulerAngles().x === 0){
				this.twHatchF.to({hatchF: -70}, 300).easing(this.ezQIO).yoyo(true).repeat(1).start();
				this.createBomb("front");
			}
		},

		dropBombB: function(){
			if(this.hatchB.getLocalEulerAngles().x === 0){
				this.twHatchB.to({hatchB: 70}, 300).easing(this.ezQIO).yoyo(true).repeat(1).start();
				this.createBomb("back");
			}
		},

		createBomb: function(direction){
			this.newBomb = this.ogBomb.clone();
			app.root.addChild(this.newBomb);
			this.newBomb.script.bomb.birth(this.entity.getPosition(), direction);
		}
	};

	return Bot;
});


