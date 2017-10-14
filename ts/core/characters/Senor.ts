export default class Senor{
	pos: THREE.Vector3;
	bot: THREE.Object3D;
	
	constructor(_botAsset: THREE.Object3D){
		this.bot = new THREE.Object3D();
		this.bot.copy(_botAsset, true);
		this.pos = new THREE.Vector3(THREE.Math.randFloat(-5, 5), 0, THREE.Math.randFloat(-5, 5));
		this.bot.position.copy(this.pos);
	}

	public move(): void{

	}

	public getBotObj(): THREE.Object3D{
		return this.bot;
	}
}