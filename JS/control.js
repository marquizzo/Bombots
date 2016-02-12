pc.script.create('control', function (app) {
	// Creates a new Control instance
	var Control = function (entity) {
		this.entity		= entity;
		this.receiver	= null;
		this.vectorX	= 0;
		this.vertorZ	= 0;
		this.yAngle		= 0;
		this.motionVec	= new pc.Vec3(0, 0, 0);
	};

	Control.prototype = {
		// Called once after all resources are loaded and before the first update
		initialize: function () {
			this.receiver	= app.root.findByName("Bot1").script.bot;
		},
		
		// Called every frame, dt is time in seconds since last update
		update: function (dt) {
			TWEEN.update();
			this.vectorX = 0;
			this.vectorZ = 0;

			// WASD Controls
			if(app.keyboard.isPressed(pc.KEY_A)){
				this.vectorX ++;
			}
			if(app.keyboard.isPressed(pc.KEY_D)){
				this.vectorX --;
			}
			if(app.keyboard.isPressed(pc.KEY_W)){
				this.vectorZ ++;
			}
			if(app.keyboard.isPressed(pc.KEY_S)){
				this.vectorZ --;
			}
			if(this.vectorX !== 0 || this.vectorZ !== 0){
				this.buttonMove(dt);
			}else{
				this.noButtonMove(dt);
			}

			// A Button
			if(app.keyboard.wasPressed(pc.KEY_O)){
				this.receiver.btnA();
			}

			// B Button
			if(app.keyboard.wasPressed(pc.KEY_P)){
				this.receiver.btnB();
			}

			// Reset
			if(app.keyboard.wasPressed(pc.KEY_R)){
				this.receiver.reset();
			}
		},

		buttonMove: function (dt){
			// Calculate y Angle from x & z vectors
			this.yAngle = Math.atan2(this.vectorX, this.vectorZ) * (180 / Math.PI);
			this.receiver.moveToAngle(this.yAngle, dt);
		},

		noButtonMove: function (dt){
			this.receiver.decelerate(dt);
		}
	};

	return Control;
});

