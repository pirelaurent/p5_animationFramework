///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />
// empty sketch for trying 
"use strict";
// global
let can;



function setup() {
  can = createCanvas(800, 800, WEBGL);
 //scenario = new Scenario({interval:3000},{scriptName: "départ", generator: essai, arguments: ['pouet']})
} // setup

function draw() {
  background(100);
  fill('red')
  sphere(50)
}
