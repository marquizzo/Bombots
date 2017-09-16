import DefaultView from "./DefaultView";
import Monoc from "../../utils/cameras/camera";
import {ICargo} from "../../utils/preloader";
import {CamOptions} from "../../utils/cameras/interfaces";

export default class GameView extends DefaultView{
	// THREE objects
	cam: Monoc;
	assets: ICargo;

	// Game objects
	bot3D: THREE.Object3D;
	bomb3D: THREE.Object3D;

	constructor(_assets: ICargo){
		super();

		this.assets = _assets;

		// Camera setup
		let camOptions = {
			distance: 10,
			distRange: {max: 30, min: 4},
			rotRange:{yMin: -1},
			rotation: new THREE.Vector3(0, 10, 0)
		};

		this.cam = new Monoc(camOptions);
		this.bot3D = (<THREE.Scene>this.assets.bot).getObjectByName("Bot");
		this.bomb3D = (<THREE.Scene>this.assets.bot).getObjectByName("Bomb");

		this.addLights();
		this.buildStage();
		let botPos = new THREE.Vector3();
		for(var i = 0; i < 10; i++){
			botPos.set(THREE.Math.randFloat(-5, 5), 0, THREE.Math.randFloat(-5, 5));
			this.newBot(botPos);
		}
	}

	private addLights(): void{
		let light = new THREE.PointLight(0xffffff, 1.0);
		light.position.set(-2, 4, 0);
		this.scene.add(light);
	}

	private buildStage():void{
		let plane = new THREE.PlaneBufferGeometry(10, 10);
		plane.rotateX(-Math.PI / 2);
		let mat = new THREE.MeshPhongMaterial({color: 0xffffff});
		let mesh = new THREE.Mesh(plane, mat);
		this.scene.add(mesh);
	}

	private newBot(_pos: THREE.Vector3):void{
		let newBot = new THREE.Object3D();
		newBot.copy(this.bot3D, true);
		newBot.position.copy(_pos);
		newBot.rotateZ(Math.PI * Math.random());
		this.scene.add(newBot);
	}

	/////////////////////////////////////// HAMMER EVENTS ///////////////////////////////////////
	public onPan(evt: HammerInput): void{
		this.cam.orbitBy(evt.velocityX, evt.velocityY);
	}

	/////////////////////////////////////// UPDATE ///////////////////////////////////////
	public update(t: number):void{
		this.cam.update();
	}
}