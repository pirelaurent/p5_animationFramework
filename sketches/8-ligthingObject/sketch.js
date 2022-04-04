///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
var obj_1;
var liberty, libertyObj;
var enlight;
var pointBlue,pointWhite, pointRed;

function preload() {
  // from a free obj on turbosquid.com author rozenkrantz
  libertyObj = loadModel("../../models/LibertyStatue.obj"); // true to normalize size
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  angleMode(DEGREES);

  obj_1 = new GraphicObject({
    name: "ball",
    fill: { color: "white" },
    stroke: { color: "grey", weight: 0.5 },
  });
  obj_1.drawModel = () => sphere(50);
// 
  liberty = new GraphicObjectModel({
    name: "liberty",
    model: libertyObj, //// from a free obj on turbosquid.com author rozenkrantz
    fill:   { active: true, color: "white" }, // no fill to see normalMaterial 
    stroke: { active: false },
    position: [0,300,0],
  });

  pointBlue = new MoveablePointLight({
    name: "blue light",
    visible: true,
    color: "blue",
    position: [-300, -100 ,-250],   // replace the default [0,0,0] to see something 
    showMe: true
  })
  pointWhite = new MoveablePointLight({
    name: "white light",
    visible: true,
    color: "white",
    position: [100,100, 250],   // replace the default [0,0,0] to see something 
    showMe: true
  })
  pointRed = new MoveablePointLight({
    name: "red light",
    visible: true,
    color: "red",
    position: [300,0, 0],   // replace the default [0,0,0] to see something 
    showMe: true
  })
  // can lights as default :  enlight = () =>lights;
  enlight = threeSpots;
 // to facilitate life set in advance for kbHelper
 kb.objectsToMove = [pointBlue, pointWhite, pointRed];


}

function draw() {
  orbitControl(1, 1, 1);
  background(80);
  kbHelp();
  enlight();
  // only for doc 
  // obj_1.draw();
  // if (frameCount == 200) enlight = red_atmosphere;
  liberty.draw();
}

// light 3 the spots 
function threeSpots(){
  pointBlue.enlight();
  pointWhite.enlight();
  pointRed.enlight();
}



// // for doc 
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