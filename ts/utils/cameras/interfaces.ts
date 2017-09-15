export interface CamOptions {
    distance?: number;
    focusPos?: THREE.Vector3;
    rotation?: THREE.Vector3;
    rotRange?: {xMax?: number, xMin?: number, yMax?: number, yMin?: number};
    distRange?: {max?: number, min?: number};
    fov?: number;
	eyeSeparation?: number;
}

export interface AccelData {
    alpha?: number;
    beta?:number;
    gamma?:number;
    orient?:number;
}