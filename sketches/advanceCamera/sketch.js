///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
// ---------------------- mvt 2 
var dragon;
var dragonObj; // model from Ghostman56 on turboSquid.com
var camera1; 
var tripodA, tripodB; // two tripod to put camera on 
var scenarioCamera;  // a scenario with several script examples 

function preload() {
  // from a free obj on turbosquid.com author rozenkrantz
  dragonObj = loadModel("../../models/dragon.obj", true); // true to normalize size
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  dragon = new GraphicObjectModel({
    name: "dragon",
    model: dragonObj, //// from a free obj on turbosquid.com author rozenkrantz
    fill: { active: true, color: [100, 255, 100, 100] },
    stroke: { color: "black" },
    scale: [3, 3, 3],
    position:[0,100,0],
    rotation: [150, 90, 0],
  });
  camera1 = createCamera();
  // better to create in setup rather in inline 
  createTripods();
  // create Scenario 
  createScenariosAndJourneys();
  // start the scenario
  scenarioCamera.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(140);
  kbHelp();
  dragon.draw();
}

function createTripods(){
  // create a tripod with default values 
  tripodA = new Tripod({
    name:"in front",
  })
  // place this tripod under the current camera 
  tripodA.mountUnderCamera(camera1);
  // prepare another place for quick change of point of view 
  tripodB = new Tripod({
    name:"look behind",
    position: [0, -200, -900],
    lookAt: [-100,0,0]
  })
}

function createScenariosAndJourneys(){
  /*
 the demo scenario chains: 
 - a first script to alternate between two tripods 
 - a second script where a camera follows a journey 
 - a third for pleasure zoom in/out in a sequence 
*/

scenarioCamera = new Scenario(
  { scenarioName: "demo camera", trace: true},
  [
    { scriptName: "alternate", generator: alternate},
    { scriptName: "zoom and move", generator: scriptJourney, arguments : [journeyCam,tripodA]},
  ])
}

/*
  define a trajectory for a mmovement of camera 
*/
var journeyCam = {
  duration_ms: 10000, // duration of the journey
  parameters: [
    {
      name: "position", 
      // use current position as a start
      end: [100,-700,1000]
    },
    {
      name: "lookAt", 
      wait_ms: 8000,
      // use current position as a start
      end: [0,0,300]
    },
  ]
}

/*
 a first script that alternate the point of view 5 times by changing camera1 of tripod 
*/
function* alternate(){
  yield 2000 // wait a bit
  for (let i=0;i<5;i++){
    // start by front camera 
    tripodA.mountCamera(camera1)
    dragon.config.stroke.color = [0,50,150];
    yield 1000
    tripodB.mountCamera(camera1);
    dragon.config.stroke.color = 'darkred';
    yield 1000
  } 
  // leave with front camera 
  tripodA.mountCamera(camera1) 
  dragon.config.stroke.color = 'black';
  yield 2000 // wait another bit before chaining 
}
