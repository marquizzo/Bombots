export interface IRequest {
	name: string;
	type: "texture" | "mesh" | "cubetexture";
	ext?: "jpg" | "png" | "json";
}

export interface ICargo{
	[key: string]: THREE.Group | THREE.Texture | THREE.CubeTexture;
}

// Takes a manifesto of assets, reports progress, & calls complete
export class Preloader{
	path: string;
	manifesto: Array<IRequest>;
	callback: Function;
	cargo: ICargo;

	loaderText: THREE.TextureLoader;
	loaderMesh: THREE.ObjectLoader;
	loaderCube: THREE.CubeTextureLoader;
	assetCount: number;
	assetTotal: number;
	pct: number;

	progBar: HTMLElement;
	container: HTMLElement;
	detailBox: HTMLElement;

	constructor(_path: string, _manifesto: Array<IRequest>, _callback: Function){
		this.path = _path;
		this.manifesto = _manifesto;
		this.callback = _callback;
		this.assetCount = 0;
		this.assetTotal = _manifesto.length;
		this.loaderText = new THREE.TextureLoader();
		this.loaderMesh = new THREE.ObjectLoader();
		this.loaderCube = new THREE.CubeTextureLoader();
		this.cargo = {};
		/*this.container = document.getElementById("preloader");
		this.progBar = document.getElementById("preProg");
		this.detailBox = document.getElementById("preDetail");*/
	}

	public start():void{
		// this.container.className = "visible";
		let ext:string;

		for(let i = 0; i < this.assetTotal; i++){
			ext = "." + this.manifesto[i].ext;
			
			switch(this.manifesto[i].type){
				case "texture":
					this.loaderText.load(
						this.path + "textures/" + this.manifesto[i].name + ext,
						function(_obj){this.assetAquired(_obj, this.manifesto[i].name)}.bind(this),
						undefined,
						function(_err){this.assetFailed(_err, this.manifesto[i].name)}.bind(this)
					);
				break;
				case "mesh":
					this.loaderMesh.load(
						this.path + "meshes/" + this.manifesto[i].name + ".json",
						function(_obj){this.assetAquired(_obj, this.manifesto[i].name)}.bind(this),
						undefined,
						function(_err){this.assetFailed(_err, this.manifesto[i].name)}.bind(this)
					);
				break;
				case "cubetexture":
					this.loaderCube.setPath(this.path + "textures/" + this.manifesto[i].name + "/");
					this.loaderCube.load(
						["xp" + ext, "xn" + ext, "yp" + ext, "yn" + ext, "zp" + ext, "zn" + ext],
						function(_obj){this.assetAquired(_obj, this.manifesto[i].name)}.bind(this),
						undefined,
						function(_err){this.assetFailed(_err, this.manifesto[i].name)}.bind(this)
					);
				break;
			}
		}
	}

	private assetAquired(_obj: THREE.Texture | THREE.Group | THREE.CubeTexture, _name: string):void{
		this.cargo[_name] = _obj;
		this.assetCount ++;
		this.pct = this.assetCount / this.assetTotal;
		// this.progBar.style.width = (this.pct * 100) + "%";
		if(this.assetCount == this.assetTotal){
			this.complete();
		}
	}

	private assetFailed(_err: Error | ErrorEvent, _name:string):void{
		this.assetCount ++;
		this.pct = this.assetCount / this.assetTotal;
		if(this.assetCount == this.assetTotal){
			this.complete();
		}
	}

	private complete():void{
		this.callback(this.cargo);
	}

	private remove():void{
		// this.container.className = "";
	}
}