import Monoc from "../../utils/cameras/camera";
import {CamOptions} from "../../utils/cameras/interfaces";

export default class DefaultView{
	// THREE objects
	scene: THREE.Scene;
	cam: Monoc;

	constructor(){
		// Scene setup
		this.scene = new THREE.Scene();
	}

	public getScene():THREE.Scene{
		return this.scene;
	}

	public getCamera():THREE.PerspectiveCamera{
		return this.cam.camera;
	}

	public windowResize(_w: number, _h: number):void{
		this.cam.onWindowResize(_w, _h);
	}

	public onPan(evt?: any):void{

	}

	public update(t: number): void{
		
	}
}