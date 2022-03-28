///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;

var dragon;
var dragonObj; // model from Ghostman56 on turboSquid.com
var scenario_0;

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

 scenario_0 = new Scenario(
   {scenarioName: "movement0 sample", trace: true},
   {scriptName: " dragon move", generator: scriptJourney, arguments:[journey, dragon]}
  ) 
  scenario_0.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(140);
  kbHelp();
  dragon.draw();
}

var journey = {
  duration_ms: 10000, // duration of the journey
  // array of parameters in this journey
  parameters: [
    {
      name: "position", // the parameter involved in the journey
      start: [0, 100, 0], // the start value of parameter. Optional.
      end: [-50, -200, -600], // the destination value of parameter
      easingOnT: (t)=>t*t*t
    },
    {
      name: "rotation", // the parameter involved in the journey
      end: [150, 230, 0], // the destination value of parameter
      easingOnT: easingOnT_flip_t2
      //easingOnT:  (t) =>  abs(sin(t*180*5))
    },
    {
      name: "fill.color", // the parameter involved in the journey
      start: [50, 50, 50], // the start value of parameter. Optional.
      end: [100, 200, 255], // the destination value of parameter
    },
  ],
};

