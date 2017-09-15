// Creates a plane that receives mouse clicks and returns a Vec3 of where it took place.
export default class Ray{
	geom: THREE.PlaneBufferGeometry;
	mat: THREE.MeshStandardMaterial;
	plane: THREE.Mesh;
	ray: THREE.Raycaster;
	cam: THREE.Camera;

	constructor(_cam: THREE.Camera){
		this.cam = _cam;
		this.ray = new THREE.Raycaster();
		this.geom = new THREE.PlaneBufferGeometry(64, 64);
		this.geom.rotateX(-Math.PI / 2);
		// this.geom.translate(0, 0, 50);
		this.mat = new THREE.MeshStandardMaterial();
		this.plane = new THREE.Mesh(this.geom, this.mat);
	}

	// Moves pane to look at camera, then returns position, or false
	public rayCast(mouse: THREE.Vector2):THREE.Vector3 | boolean{
		this.ray.setFromCamera(mouse, this.cam);

		var intersects = this.ray.intersectObject(this.plane);

		if(typeof intersects[0] !== "undefined"){
			return intersects[0].point;
		}else{
			return false;
		}
	}
}