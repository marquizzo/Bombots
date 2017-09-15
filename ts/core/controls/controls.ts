import View from "../view";

export default class Controls{
	view: View;

	constructor(){
		this.view = new View();
	}

	public update(t: number):void{
		this.view.update(t);
	}
}