
// Transforms accelerometer alpha, beta, gamma information,
// then returns readable angles via heading, attack & roll

export default class Gimbal{
	readonly RAD: number = Math.PI / 180;
	readonly DEG: number = 180 / Math.PI;

	eulerOrigin: THREE.Euler;
	angles: THREE.Euler;
	quaternion: THREE.Quaternion;
	xVec: THREE.Vector3;
	yVec: THREE.Vector3;
	zVec: THREE.Vector3;
	deviceAngle: number;		// +- 90 degrees for Landscape, Portrait, etc
	object: THREE.Object3D;

	// Output
	heading: number;	// orientation around y-axis (180, -180)
	attack: number;		// horizon (90, -90)
	roll: number;		// z-axis

	constructor(){
		this.quaternion = new THREE.Quaternion();
		this.xVec = new THREE.Vector3(1, 0, 0);
		this.yVec = new THREE.Vector3(0, 1, 0);
		this.zVec = new THREE.Vector3(0, 0, 1);
		this.deviceAngle = 0;
		this.object = new THREE.Object3D();

		this.angles = new THREE.Euler();
		this.eulerOrigin = new THREE.Euler();
		if(typeof window.orientation !== "undefined"){
			this.eulerOrigin.set(
				90 * this.RAD, 
				180 * this.RAD, 
				(180 + parseInt(window.orientation.toString(), 10)) * this.RAD
			);
		}
	}

	public onGyroMove(_a: number, _b: number, _g: number):void{
		// Alpha = z axis [0 ,360]
		// Beta = x axis [-180 , 180]
		// Gamma = y axis [-90 , 90]

		// Reset rotation
		this.object.setRotationFromEuler(this.eulerOrigin);

		// Apply gyroscope rotations to object
		this.object.rotateZ(_a * this.RAD);
		this.object.rotateX(_b * this.RAD);
		this.object.rotateY(_g * this.RAD);
		this.object.rotation.z += this.deviceAngle;

		// Extract quaternion from object
		this.quaternion.copy(this.object.quaternion.inverse());

		// Apply quat to axes
		this.yVec.set(0, 1, 0);
		this.yVec.applyQuaternion(this.quaternion);
		this.zVec.set(0, 0, 1);
		this.zVec.applyQuaternion(this.quaternion);

		// Heading is east (-) or west (+) rotation around y-axis.
		this.heading = Math.atan2(this.zVec.x, this.zVec.z) * this.DEG;

		// Attack is above or below (+/-) horizon line
		this.attack = Math.atan2(-this.yVec.z, this.yVec.y) * this.DEG;
		this.attack = Math.min(Math.max(this.attack, -90), 90);

		// Roll is left (-) or right (+) rotation around local z-axis
		this.roll = Math.atan2(-this.yVec.x, this.yVec.y) * this.DEG;
	}

	public onDeviceReorientation(_orientation: number):void{
		this.deviceAngle = _orientation * this.RAD;
	}
}