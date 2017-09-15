// Converts a value to 0 - 1 from its min - max bounds
export function normalize(val: number, min: number, max: number): number{
	return Math.max(0, Math.min(1, (val-min) / (max-min)));
}

// Converts a value to 0 - 1 from its min - max bounds in quadratic in form
export function normalizeQuadIn(val: number, min: number, max: number): number{
	return Math.pow(normalize(val, min, max), 2.0);
}

// Converts a value to 0 - 1 from its min - max bounds in quadratic out form
export function normalizeQuadOut(val: number, min: number, max: number): number{
	let x = normalize(val, min, max);
	return x * (2.0 - x);
}

// Tween to target using Zeno's Paradox
export function zTween(_val: number, _target: number, _ratio: number): number{
	return _val + (_target - _val) * Math.min(_ratio, 1.0);
}

// Keeps track of time in seconds
// and caps rendering to match desired FPS
export class Time{
	fps: number;			// Frames per second
	spf: number;			// Seconds per frame
	prev: number;		// Previous time
	delta: number;		// Time diff. between previous and current frame
	prevBreak:number;	// Previous time, divisible by SPF
	deltaBreak: number;	// Accumulates time delta until it passes SPF ratio
	timeFact: number;	// Multiplier to speed up /slow down time
	frameCount: number;		// Counts frames that haven't matched FPS

	readonly fallBackRates: Array<number> = [60, 40, 30, 20, 15];
	fallBackIndex: number;

	constructor(timeFactor?: number){
		this.prev = 0;
		this.prevBreak = 0;
		this.delta = 0;
		this.timeFact = (typeof timeFactor === "undefined") ? 1 : timeFactor;

		this.frameCount = 0;
		this.fallBackIndex = 0;
		this.setFPS(60);
	}
	
	public update(_newTime:number): boolean{
		this.deltaBreak = Math.min(_newTime - this.prevBreak, 1.0);

		// Update time if enough time has passed
		if(this.deltaBreak > this.spf){
			this.delta = Math.min(_newTime - this.prev, 1.0);
			this.prev = _newTime;
			this.prevBreak = _newTime - (this.deltaBreak % this.spf);
			// this.checkFPS();
			
			// Returns true to render frame
			return true;
		}else{
			// Returns false to skip frame
			return false;
		}
	}

	private checkFPS():void{
		if(this.delta > this.spf * 2){
			this.frameCount ++;
			console.log(this.frameCount);
			if(this.frameCount > 30){
				this.frameCount = 0;
				this.fallBackIndex ++;
				this.setFPS(this.fallBackRates[this.fallBackIndex]);
			}
		}
	}

	private setFPS(_newVal: number):void{
		this.fps = _newVal;
		this.spf = 1 / this.fps;
	}
}

// Fisher-Yates Shuffle
export function shuffle(array: any[]) : any[]{
	var m = array.length, t, i;

	// While there remain elements to shuffle
	while(m){
		// Pick a remaining element
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}

export function mod(n, m) {
	return ((n % m) + m) % m;
}