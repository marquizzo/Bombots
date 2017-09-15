import {CamOptions, AccelData} from "./interfaces";

export default class CamControl{
	camera: THREE.PerspectiveCamera;
	focusActual: THREE.Vector3;
	focusTarget: THREE.Vector3;

	// Distance from focusPos
	distActual: number;
	distTarget: number;

	rotTarget: THREE.Vector3;
	rotActual: THREE.Vector3;
	quatX: THREE.Quaternion;
	quatY: THREE.Quaternion;

	options: CamOptions;
	gyro: AccelData;
	defaultEuler: THREE.Euler;
	radians:number;

	// X and Y Axes
	private static axisX = new THREE.Vector3(1, 0, 0);
	private static axisY = new THREE.Vector3(0, 1, 0);

	constructor(options?: CamOptions){
		// Default options
		this.options = {
			fov: 45,
			distance : 90,
			distRange: {
				max: Number.POSITIVE_INFINITY, 
				min: Number.NEGATIVE_INFINITY
			},
			focusPos : new THREE.Vector3(),
			rotation : new THREE.Vector3(),
			rotRange : {
				xMax: Number.POSITIVE_INFINITY,
				xMin: Number.NEGATIVE_INFINITY,
				yMax: 90,
				yMin: -90,
			},
			eyeSeparation: 0.0 // Ignored
		};

		// Replace defaults with custom options
		for(var key in options){
			if(key === "rotRange"){
				for(var key in options.rotRange){
					this.options.rotRange[key] = options.rotRange[key];
				}
			}else if(key === "distRange"){
				for(var key in options.distRange){
					this.options.distRange[key] = options.distRange[key];
				}
			}else{
				this.options[key] = options[key];
			}
		}

		// Set attributes from options
		this.distActual = this.options.distance;
		this.distTarget = this.options.distance;
		this.focusActual = this.options.focusPos.clone();
		this.focusTarget = this.options.focusPos.clone();
		this.rotActual = this.options.rotation.clone();
		this.rotTarget = this.options.rotation.clone();
		
		let vpW = window.innerWidth;
		let vpH = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera(this.options.fov, vpW/vpH, 0.1, 100);

		// Helpers to calculate rotations
		this.radians = Math.PI / 180;
		this.quatX = new THREE.Quaternion();
		this.quatY = new THREE.Quaternion();
		this.gyro = {
			orient: 0
		};
		
		// Set default orientation for accelerator rotations
		if(typeof window.orientation !== "undefined"){
			this.defaultEuler = new THREE.Euler(
				90 * this.radians, 
				180 * this.radians, 
				(180 + parseInt(window.orientation.toString(), 10)) * this.radians
			);
		}else{
			this.defaultEuler = new THREE.Euler(0, 0, 0);
		}
	}

	/////////////////////////////////////// SET ATTRIBUTES ///////////////////////////////////////
	// Sets distance from focusPos
	public setDistance(dist: number = 150): void{
		this.distActual = dist;
		this.distTarget = dist;
	}
	// Sets max and min angles of orbit
	public setAngleRange(xMax: number = Number.POSITIVE_INFINITY, xMin: number = Number.NEGATIVE_INFINITY, yMax: number = 90, yMin: number = -90): void{
		this.options.rotRange.xMax = xMax;
		this.options.rotRange.xMin = xMin;
		this.options.rotRange.yMax = yMax;
		this.options.rotRange.yMin = yMin;
	}

	// Sets angle of rotation
	public setRotation(_rotX: number = 0, _rotY: number = 0, _rotZ: number = 0): void{
		this.rotActual.set(_rotX, _rotY, _rotZ);
		this.rotTarget.set(_rotX, _rotY, _rotZ);

		this.gyro.alpha = undefined;
		this.gyro.beta = undefined;
		this.gyro.gamma = undefined;
	}

	// Sets focus position
	public setFocusPos(_posX: number = 0, _posY: number = 0, _posZ: number = 0): void{
		this.focusActual.set(_posX, _posY, _posZ);
		this.focusTarget.set(_posX, _posY, _posZ);
	}

	/////////////////////////////////////// MOTION ///////////////////////////////////////
	// Camera travels away or toward focusPos
	public dolly(distance: number): void{
		this.distTarget += distance / 100;
		this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
	}

	// Camera orbits by an angle amount
	public orbitBy(angleX: number, angleY: number): void{
		this.rotTarget.x += angleX;
		this.rotTarget.y += angleY;
		this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
		this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
	}

	// Camera orbits to an angle
	public orbitTo(angleX: number, angleY: number): void{
		this.rotTarget.x = angleX;
		this.rotTarget.y = angleY;
		this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
		this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
	}

	// FocusPos moves along the XY axis
	public pan(distX: number, distY: number): void{
		this.focusTarget.x -= distX / 10;
		this.focusTarget.y += distY / 10;
	}

	/////////////////////////////////////// DOM EVENTS ///////////////////////////////////////
	// Window resize triggered
	public onWindowResize(vpW: number, vpH: number):void{
		this.camera.aspect = vpW / vpH;
		this.camera.updateProjectionMatrix();
	}

	// Landscape-portrait change on mobile devices
	public onDeviceReorientation(orientation: number):void{
		this.gyro.orient = orientation * this.radians;
	}

	// Set accelerometer data on motion
	public onGyroMove(alpha: number, beta: number, gamma: number):void{
		let acc = this.gyro;
		// Alpha = z axis [0 ,360]
		// Beta = x axis [-180 , 180]
		// Gamma = y axis [-90 , 90]
		acc.alpha = alpha;
		acc.beta = beta;
		acc.gamma = gamma
	}

	/////////////////////////////////////// UTILS ///////////////////////////////////////
	// Called once per frame
	public update(): void{
		// Place camera on focus position
		this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
		this.distActual += (this.distTarget - this.distActual) * 0.01;
		this.focusActual.lerp(this.focusTarget, 0.05);
		this.camera.position.copy(this.focusActual);

		// If accelerometer data present
		if(this.gyro.alpha && this.gyro.beta && this.gyro.gamma){
			// Calculate camera rotations
			this.camera.setRotationFromEuler(this.defaultEuler);
			this.camera.rotateZ(this.gyro.alpha * this.radians);
			this.camera.rotateX(this.gyro.beta * this.radians);
			this.camera.rotateY(this.gyro.gamma * this.radians);
			this.camera.rotation.z += this.gyro.orient;
		}
		// If no accelerometer data
		else{
			// Calculate camera rotations
			this.rotActual.lerp(this.rotTarget, 0.05);
			this.quatX.setFromAxisAngle(CamControl.axisX, -THREE.Math.degToRad(this.rotActual.y));
			this.quatY.setFromAxisAngle(CamControl.axisY, -THREE.Math.degToRad(this.rotActual.x));
			this.quatY.multiply(this.quatX);
			this.camera.quaternion.copy(this.quatY);
		}

		// Set camera distance from focus position
		this.camera.translateZ(this.distActual);
	}

	public follow(target: THREE.Vector3):void{
		// Place camera on focus position
		this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
		this.distActual += (this.distTarget - this.distActual) * 0.01;
		this.focusTarget.set(target.x, target.y + 1.0, target.z + this.distActual);
		this.focusActual.lerp(this.focusTarget, 0.01);
		this.camera.position.copy(this.focusActual);
		this.camera.lookAt(target);
	}
}