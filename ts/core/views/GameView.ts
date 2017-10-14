import DefaultView from "./DefaultView";
import Monoc from "../../utils/cameras/camera";
import Senor from "../characters/Senor";
import {ICargo} from "../../utils/preloader";
import {CamOptions} from "../../utils/cameras/interfaces";

export default class GameView extends DefaultView{
	// THREE objects
	cam: Monoc;
	assets: ICargo;

	// Game objects
	botAsset: THREE.Object3D;
	bombAsset: THREE.Object3D;

	client: Senor;

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
		this.botAsset = (<THREE.Scene>this.assets.bot).getObjectByName("Bot");
		this.bombAsset = (<THREE.Scene>this.assets.bot).getObjectByName("Bomb");

		this.addLights();
		this.buildStage();

		this.client = new Senor(this.botAsset);
		this.scene.add(this.client.getBotObj());
	}

	private addLights(): void{
		let light = new THREE.PointLight(0xffeecc, 1.0);
		light.position.set(-2, 4, 0);
		this.scene.add(light);

		this.scene.background = this.assets.skybox;
	}

	private buildStage():void{
		let plane = new THREE.PlaneBufferGeometry(10, 10);
		plane.rotateX(-Math.PI / 2);
		let mat = new THREE.MeshPhongMaterial({color: 0xffffff});
		let mesh = new THREE.Mesh(plane, mat);
		this.scene.add(mesh);
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