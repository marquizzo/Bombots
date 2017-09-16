import SceneControl from "./SceneControl";

// Controls handles all events and sends to SceneControl
export default class Controls{
	sceneControl: SceneControl;
	hammer: HammerManager;
	stats: Stats;

	constructor(){
		this.sceneControl = new SceneControl();
		this.stats = new Stats();
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

	private onWindowResize():void{
		this.sceneControl.windowResize();
	}

	private update(t: number):void{
		this.sceneControl.update(t);
		this.stats.update();
		requestAnimationFrame(this.update.bind(this));
	}
}