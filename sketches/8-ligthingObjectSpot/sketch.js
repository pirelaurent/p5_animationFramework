///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
var liberty, libertyObj;
var enlight;
var spotBlue, spotWhite, spotRed;
var threeLightsGroup;
let scenarioThreeLights 

function preload() {
  // from a free obj on turbosquid.com author rozenkrantz
  libertyObj = loadModel("../../models/LibertyStatue.obj"); // true to normalize size
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  //angleMode(DEGREES);

  liberty = new GraphicObjectModel({
    name: "liberty",
    model: libertyObj, //// from a free obj on turbosquid.com author rozenkrantz
    fill: { active: true, color: "white" }, // no fill to see normalMaterial
    stroke: { active: false },
    position: [0, 300, 0],
  });

  spotBlue = new MoveableSpotLight({
    name: "blue light",
    lit: true,
    color: "lightblue",
    position : [-230,50,250] ,
    direction: [1,0,-1],   // left side 
    visible: true,
  });
  spotWhite = new MoveableSpotLight({
    name: "white light",
    lit: true,
    color: "white",
    // leave default direction [0,0,-1] ie in front 
    position: [0,-30,230], 

    visible: true,
  });
  spotRed = new MoveableSpotLight({
    name: "red light",
    lit: true,
    color: "red",
    position: [120,-200,140], 
    direction: [-1,1,-1],  // from right upper side 
    visible: true,
  });

  /*
   create a group with the three lights to move them easily in a same journey. 
   as no need of methods, can use a simple literal 
  */

  threeLightsGroup = {
    name: "3 lights",
    blue: spotBlue,
    red: spotRed,
    white: spotWhite,
  };
console.log(threeLightsGroup);//PLA
  scenarioThreeLights = new Scenario(
    { scenarioName: "move three lights", trace: true },
    [  // array of scripts for this scenario . Here just one 
      { scriptName: " 3 lights", generator: scriptJourney, arguments: [journeyFor3Lights,threeLightsGroup] }
    ] )



  // can lights as default :  enlight = () =>lights;
  enlight = threeSpots;
  // to facilitate life set in advance for kbHelper
  kb.objectsToMove = [spotBlue, spotWhite, spotRed];
}

function draw() {
  orbitControl(1, 1, 1);
  background(40);
  kbHelp();
  enlight();
  liberty.draw();
}

// light 3 the spots
function threeSpots() {
  spotBlue.enlight();
  spotWhite.enlight();
  spotRed.enlight();
}

// for first sample code in doc
// function red_atmosphere(){
//     ambientLight("darkred");
//     //'red on below' look at y negative
//     directionalLight(250, 0, 0, 0, -1, 0);
//     // orange on left : look at some X on right screen
//     directionalLight(255, 165, 0, 1, 0, 0);
//     // gold on top
//     directionalLight(color("gold"), 0, 1, 0);
//     // light in front look at z<0
//         directionalLight(color("black"), 0, 0, -1);
// }

var journeyFor3Lights = {
  duration_ms: 20000, // duration of the journey
  // array of parameters in this journey
  parameters: [
    { 
      name: "blue.position", // the parameter involved in the journey
      start: [-100, 100, 200], // the start value of parameter. Optional.
      end: [100, -200, 100], // the destination value of parameter
    },
    {
      name: "red.position", 
      easingOnT: (t)=> (1-t),
      start: [200,-400,-200], 
      end:   [20,50,350], 
      bezier: {
        inter1: [-380,-370,-240], 
        inter2: [-450,250,310] 
      },
    },
    {
      name: "white.position", 
      start: [200,-400,-200], 
      end:   [20,50,350], 
      bezier: {
        inter1: [-380,-370,-240], 
        inter2: [-450,250,310] 
      },
    }
  ]

}



