///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
// ---------------------- mvt 2 
var liberty;
var libertyObj; // model from free3D
var camera1; 
var initialTripod; 
var beltOfTripods=[];  
var scenarioTurnAround;

function preload() {
  // from a free obj on turbosquid.com author rozenkrantz
  libertyObj = loadModel("../../models/LibertyStatue.obj"); // true to normalize size
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  angleMode(DEGREES);
  liberty = new GraphicObjectModel({
    name: "liberty",
    model: libertyObj, //// from a free obj on turbosquid.com author rozenkrantz
    fill:   { active: true, color: "white" }, // no fill to see normalMaterial 
    stroke: { active: false },
    position: [0,300,0],
  });

  camera1 = createCamera();
  initialTripod = new Tripod({name: "default camera"});
  initialTripod.mountUnderCamera(camera1);
  createTripods();
  createScenariosAndJourneys();
  scenarioTurnAround.start();
 // Once done can move the camera 
  kb.objectsToMove.push(initialTripod); // slot 0
}

function draw() {
  orbitControl(1, 1, 1);
  background(30);
  kbHelp();
  ambientLight(50)
  pointLight(color('blue'), -300, -100 ,-250);
  pointLight(color('white'),100,100, 250);
  pointLight(color('red'),300,0, 0);
  liberty.draw();

}
/* 
create a beltOfTripods of tripods around liberty 
*/
function createTripods(){
 var angle = 0; 
 var distance = 300;
 while (angle <360){
  var x = 2*distance * sin(angle) ; 
  var z = 2*distance * cos (angle);
  var y = 0; 
  var tripod = new Tripod(
    { name:'at '+angle,
      position:[x,y,z],
      lookAt:[0,0,0]
  })
  beltOfTripods.push(tripod);
 angle+=60;
 }
}

function createScenariosAndJourneys(){
  /*
 turn around liberty by jumping tripod to tripod 
*/

scenarioTurnAround = new Scenario(
  { scenarioName: "turn around Liberty", trace: true},
  [
    { scriptName: "jump on tripods", generator: jumpTripod, arguments:[camera1, 1 ]},
  ])
}




function * jumpTripod(aCam, maxTurns){
  let index = 0;
  let turns = 0 ; 
  while (turns<maxTurns){
    console.log("Camera on tripod "+index)
    beltOfTripods[index].mountCamera(aCam);
    yield 3000
    beltOfTripods[index].movePosition([0,-200,0])
    index+=1;
    if( index==beltOfTripods.length) {
      index = 0;
      turns+=1;
    }
  }// while 
   // once all done, set camera on the initial tripod to play with keyboard
 initialTripod.mountCamera(aCam)
}