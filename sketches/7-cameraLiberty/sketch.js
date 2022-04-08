///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
// ---------------------- mvt 2 
var liberty;
var libertyObj; // model from free3D
var camera1; 
var debugTripod; 
var beltOfTripods=[];
var movingTripod, scenarioMoveUpDown;  
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
  createTripods();
  createScenariosAndJourneys();
  // turn around will launch scenarioMoveUp at its end 
  scenarioTurnAround.start();
  // Keyboard can be used to move this debugTripod as 0 
  kb.objectsToMove.push(debugTripod); // slot 0
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
pointLight()
}
/* 
create a beltOfTripods of tripods around liberty 
*/
function createTripods(){
  // a tripod to move with keyboard
  debugTripod = new Tripod4Camera({name: "default camera"});
  // create also the tripod for movement 
  movingTripod = new Tripod4Camera({name: "moving tripod"}); // used in journey

  // then  create a belt of tripods around liberty
 var angle = 0; 
 var distance = 300;
 while (angle <360){
  var x = 2*distance * sin(angle) ; 
  var z = 2*distance * cos (angle);
  var y = 0; 
  var tripod = new Tripod4Camera(
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
    { scriptName: "jump on tripods", generator: jumpTripod, arguments:[camera1, 3 ]},
  ])


function * jumpTripod(aCam, maxTurns){
  let index = 0;
  let turns = 0 ; 
  while (turns<maxTurns){
    console.log("Camera on tripod "+index)
    beltOfTripods[index].mountCamera(aCam);
    yield 800
    beltOfTripods[index].movePosition([0,-200,0])
    index+=1;
    if( index==beltOfTripods.length) {
      index = 0;
      turns+=1;
    }
  }// while 
  console.log(' will lauch camera bezier movement in 3 seconds')
  yield 3000
  movingTripod.mountCamera(camera1);
  scenarioMoveUpDown.start();
  // wait the end of scenario . Check every s 
  while (!scenarioMoveUpDown.isEnded) yield 1000
  console.log(' set camera on debugTripod for keyboard movements') 
   // once all done, set debugTripod at the last position 
 debugTripod.mountUnderCamera(aCam)
}

/*
 turn around liberty from up to down using a beziers trajectory 
*/
// an "elegant" camera movement 
let journeyTripod ={
  duration_ms: 20000,
  parameters: [
    {
      name: "position", 
      start: [200,-400,-200], 
      end:   [20,50,350], 
      bezier: {
        inter1: [-380,-370,-240], 
        inter2: [-450,250,310] 
      },
      easingOnT: (t)=>t*t
    }]
}
// scenario to run the journey definition
scenarioMoveUpDown = new Scenario({ scenarioName: " tripod journey ", trace: true},
  { scriptName: "up to down",generator: scriptJourney, arguments: [journeyTripod, movingTripod] 
})
// tip: if only one script, can omit the [] around
}

