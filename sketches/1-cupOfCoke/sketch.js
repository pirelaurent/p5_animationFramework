///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
// global
let can;

let myCups = [];
let cola_cup, textureWater;

function preload() {
  // from a free obj on turbosquid.com author rozenkrantz
  cola_cup = loadModel("../../models/cola_cup.obj");
  // load a texture
  textureWater = loadImage("../../textures/water.jpg");
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  // rectify coordinates m ust be done in setup to ensure geo is loaded
  // here  y=-y as P5 is yDown and obj was designed yUp
  multiplyGeometry(cola_cup, createVector(1, -1, 1));
  // instanciate with modifier and associate preloaded model
  let aCup = new GraphicObjectModel({
    model: cola_cup,
    texture: { active: true, image: textureWater },
    name: "my favorite cup",
    fill: { active: true, color: "red" },
    stroke: { color: "darkred" },
    angleMode: DEGREES,
  });
  // add to collection
  myCups.push(aCup);
  // create another with a texture
  aCup = new GraphicObjectModel({
    model: cola_cup,
    texture: { active: true, image: textureWater },
    name: "my beautiful cup",
    stroke: { active: false },
    position: [100, 100, 0],
    angleMode: DEGREES,
  });
  myCups.push(aCup);
} // setup

function draw() {
  background(20);
  orbitControl(1, 1, 5);
  kbHelp();
  for (let aCup of myCups) aCup.draw();
  // animate a while
  if (frameCount % 10 == 0)
    for (let aCup of myCups) {
      aCup.config.position[0] += random(-2, 2);
      aCup.config.rotation[2] += random(-5, 5);
    }
}

/*
for info : 
  orbitControl generates some times a violation message :
  [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event.
  The message appears at the first move of clic of the mouse on the canvas when there is an orbitcontrol in the draw loop . 

   This message is of low level:  Must be on 'verboses' in the console levels. 
   Don't care . 
*/
