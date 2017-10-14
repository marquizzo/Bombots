import SceneControl from "./SceneControl";

// Controls handles all events and sends to SceneControl
export default class Controls{
	sceneControl: SceneControl;
	hammer: HammerManager;
	stats: Stats;
	keys: Array<number>;		// Array of keys down

	constructor(){
		this.sceneControl = new SceneControl();
		this.stats = new Stats();
		this.keys = new Array();
		document.body.appendChild(this.stats.dom);

		this.setDefaultEvents();
	}

	private setDefaultEvents():void{
		this.hammer = new Hammer(document.body);
		window.addEventListener("resize", this.onWindowResize.bind(this), false);

		// Start hammer events
		this.hammer.get("pan").set({direction: Hammer.DIRECTION_ALL, threshold: 3});
		this.hammer.on("pan", this.sceneControl.onPan.bind(this.sceneControl));

		// Trigger animationFrame
		this.update(0);
	}

	/////////////////////////////////////// KEYBOARD EVENTS ///////////////////////////////////////
	private initKeyboard():void{
		window.addEventListener("keydown", this.onKeyDown.bind(this), false);
		window.addEventListener("keyup", this.onKeyUp.bind(this), false);
	}

	public onKeyDown(evt: KeyboardEvent):void{
		// Add key to list if they don't exist yet
		if(this.keys.indexOf(evt.keyCode) === -1){
			this.keys.push(evt.keyCode);
		}
	}

	public onKeyUp(evt: KeyboardEvent):void{
		//Otherwise, remove from keys list
		this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
	}

	private readKeyboardInput():void{
		for(let i = 0; i < this.keys.length; i++){
			switch (this.keys[i]) {
				case 38:	// Up
				break;
				case 40:	// Down
				break;
				case 37:	// Left
				break;
				case 39:	// Right
				break;
			}
		}
	}

	/////////////////////////////////////// OTHER EVENTS ///////////////////////////////////////
	private onWindowResize():void{
		this.sceneControl.windowResize();
	}

	private update(t: number):void{
		if(this.keys.length > 0){
			this.readKeyboardInput();
		}
		// else if (this.joyVec.x != 0 || this.joyVec.y != 0){
		// 	this.readJoyStickInput();
		// }
		this.sceneControl.update(t);
		this.stats.update();
		requestAnimationFrame(this.update.bind(this));
	}
}