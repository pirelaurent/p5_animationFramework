///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />
/*
 same as previous, but position is postponed after rotation 
*/
"use strict";
var can;
// ---------------------- mvt 2 
var dragon;
var dragonObj; // model from Ghostman56 on turboSquid.com
//  ----- to see bezier 
var scenario_0;

function preload() {
  // from a free obj on turbosquid.com author rozenkrantz
  dragonObj = loadModel("../../models/dragon.obj", true); // true to normalize size
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  angleMode(DEGREES)
  dragon = new GraphicObjectModel({
    name: "dragon",
    model: dragonObj, //// from a free obj on turbosquid.com author rozenkrantz
    fill: { active: true, color: [100, 255, 100, 100] },
    stroke: { color: "black" },
    scale: [3, 3, 3],
    position:[0,100,0],
    rotation: [150, 90, 0],
  });


 scenario_0 = new Scenario(
   {scenarioName: 'movement0 sample', trace: true},
  [ {scriptName: " dragon move", generator: scriptJourney, arguments: [aJourney, dragon] },
]
  ) 
  scenario_0.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(140);
  kbHelp();
  dragon.draw();
}

var aJourney = {
  duration_ms: 10000, // duration of the journey
  parameters: [
    {
      name: "position", 
      wait_ms: 8000,
      duration_ms: 1000, 
      start: [0, 100, 0], 
      end: [-50, -200, -600], 
      easingOnT: (t)=>t*t*t
    },
    {
      name: "rotation", 
      duration_ms: 6000,
      end: [150, 230, 0], 
      easingOnT: easingOnT_flip_t2
    },
    {
      name: "fill.color", 
      duration_ms: 3000,
      start: [50, 50, 50], 
      end: [100, 200, 255],
    },
    {
      name: "fill.color", 
      wait_ms: 3500, 
      duration_ms: 2000,
      end: [255, 255, 255], 
    },
    {
      name: "fill.color", 
      wait_ms: 7000,
      end: [0, 200, 200], 
    },
  ],
};

