pc.script.create('bomb', function (app) {
	// Creates a new Bomb instance
	var Bomb = function (entity) {
		this.entity = entity;
		this.parent = null;
		this.pName = "";
		this.timer = 3;
		this.ticking = false;
	};

	Bomb.prototype = {
		// Called once after all resources are loaded and before the first update
		initialize: function () {
			this.parent = this.entity.getParent();
			this.pName = this.parent.getName();
			console.log(this.entity);
		},

		// Called every frame, dt is time in seconds since last update
		update: function (dt) {
			if(this.ticking){
				this.timer -= dt;
				if(this.timer <= 0){
					this.explode();
				}
			}else{

			}
		},

		birth: function(birthPos, direction){
			this.ticking = true;
			this.entity.setPosition(birthPos);
		},

		explode: function(){
			this.entity.destroy();
		}
	};

	return Bomb;
});