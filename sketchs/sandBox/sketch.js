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
 //scenario = new Scenario({interval:3000},{scriptName: "départ", generator: essai, arguments: ['pouet']})

 scenario = new Scenario({interval:1000},
  [
    { scriptName: "départ", generator: essai, arguments: ['pouet']},
    { scriptName: "plus", generator: essai, arguments: ['plus']}
]
)

 scenario.start();
// var toto = { xx: 12, name:"AAAA"};
// var x =["pouet",33,toto]
// // spread operator 
// cible(...x)
// //cible(x)


} // setup

function draw() {
  background(100);
}


function cible(a,b,c){
  console.log("a:"+a)
  console.log("b:"+b)
  console.log("c:"+c.name)
 console.log(arguments)

}