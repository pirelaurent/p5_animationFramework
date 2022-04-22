///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";

var radius = 40;
var ball= {radius:40, color: 'red', visible: true } 
//var animation = animate();
var ballGrows; 
function setup(){
 createCanvas(800,800)
 ballGrows = new Scenario(animate);
 ballGrows.start();
}


function draw(){
    background(20);
    noFill();
    translate (width/2, height/2);
    stroke(ball.color);
    if (ball.visible) circle(0,0,ball.radius)
    // let step = animation.next();
    // if( ! step.done) console.log(step.value);
    // if (frameCount == 500) animation = animate();
}


function* animate(){
  ball.color = "red"
  ball.radius = 100;
  yield 3000
  ball.radius = 200;
  ball.color  = "blue";
  yield 2000
  while (ball.radius < 400) { //grows every 1000 ms up to 400
      yield 1000
      ball.radius += 10 
  }
} 


class Scenario {
    constructor(aGenerator){
        this.generator = aGenerator; 
    }
    start(){
        console.log("scenario starts");
        this.animation= this.generator();
        this.advance();
    }
    advance() {
        var step = this.animation.next();
        if (!step.done) {
          var nextDueDate = step.value;
          // postpone its job , but wants to be recalled with its scenario context
          this.timeoutId = setTimeout(this.advance.bind(this), nextDueDate);
        } else {
          console.log("scenario is ended")
        }
      }
}