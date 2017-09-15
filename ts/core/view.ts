import Monoc from "../utils/cameras/camera";
import {CamOptions} from "../utils/cameras/interfaces";

export default class View{
	vpW: number;
	vpH: number;

	// THREE objects
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	cam: Monoc;
	mesh: THREE.Mesh;

	constructor(){
		// Scene setup
		this.vpW = window.innerWidth;
		this.vpH = window.innerHeight;
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.vpW, this.vpH);
		document.getElementById("pageCanvas").appendChild(this.renderer.domElement);

		// Camera setup
		let camOptions = {
			distance: 10,
			distRange: {max: 30, min: 4},
			rotRange:{yMin: -1}
		};

		this.cam = new Monoc(camOptions);

		this.showDot();
	}

	private showDot():void{
		let geom = new THREE.SphereBufferGeometry(1, 20, 20);
		let mat = new THREE.MeshBasicMaterial({color:0xff9900, wireframe: true});
		this.mesh = new THREE.Mesh(geom, mat);
		this.scene.add(this.mesh);

		var axisHelper = new THREE.AxisHelper( 3 );
		this.scene.add( axisHelper );
	}

	public update(t: number):void{
		this.cam.update();
		this.mesh.rotateX(0.001);
		this.mesh.rotateZ(0.003);
		this.renderer.render(this.scene, this.cam.camera);
	}
}