/*
 à voir l'intérêt du set par rapport à un patchConfigControlled
 par contre, on n'a pas de get interprété;
 peut-on faire directement un {disp.stroke.color[1]} dans une config ??
*/

var traffic_0; 
var traffic_1;
var scenario_2,traffic_2;

function preload() {}

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.position(0, 0);
  traffic_0 = new TrafficLight();
  // start the scenario 0 
  europeanScenario.start();

  // create another light this time using the internal embedded script in the object
  traffic_1 = new TrafficLight();
  traffic_1. startEuropeanScenario();

  // create another scenario with another script, with parameters. We indicate to the scenario how to run it
  traffic_2 = new TrafficLight();
  scenario_2 = new Scenario({name: "with param", trace: true}, europeanScriptWithParameter);
  // override the setProgram to change the way the generator is instanciated 
  scenario_2.setProgram = function(){ 
    this.program = this.script(traffic_2);
  }
  // start the scenario
  scenario_2.start();
}


function draw() {
 orbitControl(1,1,1)
 background(60);
 translate(-150,-100,0)
 traffic_0.draw();
 translate (100,0,0);
 traffic_1.draw();
 translate (100,0,0);
 traffic_2.draw();

// the scenarios run for ever. We stop it after some time to conclude this tuto
if(millis()>60000){
  if(!europeanScenario.isEnded) europeanScenario.stop();
  traffic_0.active = false;
}
if(millis()>80000){
  if(! traffic_1.europeanScenario.isEnded) traffic_1.europeanScenario.stop();
  traffic_0.active = false;
}
if(millis()>90000){
  if(!scenario_2.isEnded) scenario_2.stop();
  traffic_2.active = false;
}

}




