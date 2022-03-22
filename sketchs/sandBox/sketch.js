///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
// global
let can;
var scenario;
function * essai(aParam){
 console.log('un '+aParam);
 yield 
 console.log('deux '+ aParam);
 yield
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
 scenario = new Scenario({interval:3000},{name: "départ", instance: essai('pouet')})
 scenario.start();

} // setup

function draw() {
  background(100);
}


