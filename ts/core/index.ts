import Controls from "./controls/controls";

// Scene vars
var control: Controls;

///////////////////////////// SCENE SETUP /////////////////////////////
function initApp(){
    control = new Controls();
    render(0);
}

function render(t): void{
    control.update(t * 0.001);
    requestAnimationFrame(render);
}

initApp();