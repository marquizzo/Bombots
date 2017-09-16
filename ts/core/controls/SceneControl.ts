import GameView from "../views/GameView";
import DefaultView from "../views/DefaultView";
import {Preloader, IRequest, ICargo} from "../../utils/preloader";

export default class SceneControl{
	vpW: number;
	vpH: number;
	preloader: Preloader;
	assets: ICargo;
	
	// Views
	gView: GameView;
	
	// Currently active items
	renderer: THREE.WebGLRenderer;
	activeScene: THREE.Scene;
	activeCam: THREE.PerspectiveCamera;
	activeView: DefaultView;
	activeType: string; // preload, menu, game, or score

	constructor(){
		this.vpW = window.innerWidth;
		this.vpH = window.innerHeight;
		this.activeScene = null;
		this.activeCam = null;
		this.activeView = new DefaultView();
		this.activeType = "preload";

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.vpW, this.vpH);
		document.getElementById("pageCanvas").appendChild(this.renderer.domElement);

		this.preload();
	}

	private preload(): void{
		let manifesto: Array<IRequest> = [
			// Bot geometry
			{name: "bot", type: "mesh", ext: "json"},
		];

		let path = "";

		this.preloader = new Preloader(path, manifesto, this.preloadComplete.bind(this));
		this.preloader.start();
	}

	private preloadComplete(_assets: ICargo): void{
		this.assets = _assets;
		this.gView = new GameView(this.assets);
		this.changeActiveScene();
	}

	private changeActiveScene(): void{
		this.activeType = "game";
		this.activeView = this.gView;
		this.activeScene = this.activeView.getScene();
		this.activeCam = this.activeView.getCamera();
		this.activeView.windowResize(this.vpW, this.vpH);
	}

	public windowResize(): void{
		this.vpW = window.innerWidth;
		this.vpH = window.innerHeight;
		this.renderer.setSize(this.vpW, this.vpH);
		this.activeView.windowResize(this.vpW, this.vpH);
	}

	/////////////////////////////////////// HAMMER EVENTS ///////////////////////////////////////
	public onPan(evt: HammerInput): void{
		this.activeView.onPan(evt);
	}

	/////////////////////////////////////// UPDATE ///////////////////////////////////////
	public update(t: number): void{
		this.activeView.update(t);
		this.renderer.render(this.activeScene, this.activeCam);
	}
}