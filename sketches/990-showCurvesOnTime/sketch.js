///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
// global
let can;

function setup() {
  can = createCanvas(500, 500);
  angleMode(DEGREES);
} // setup

function draw() {
  background(55);
  translate(100, 400);
  strokeWeight(2);
  stroke("white");
  var w = 200;
  line(0, 0, w, 0);
  line(0, 0, 0, -w);
  // bords
  stroke(90);
  line(0, -w, w, -w);
  line(w, -w, w, 0);
  // à 50
  line(w / 2, 0, w / 2, -w);

  fill("white");
  text("1", 205, 5);
  text("0", -10, 5);
  text("0.5", w / 2 - 5, 10);
  text("Elapsed time", 200, 20);
  text("1", -10, -200);
  text("Estimated time", -40, -215);

  var t = 0;
  while (t <= 1) {
    stroke("white");
    let tCalc = t;
    point(t * w, -tCalc * w);

    //---------------------------
    stroke("green");
    //tCalc = tPrime2(t);
    tCalc = easingOnT_t2(t);
    point(t * w, -tCalc * w);
    tCalc = easingOnT_t3(t);
    point(t * w, -tCalc * w);
    tCalc = easingOnT_t4(t);
    point(t * w, -tCalc * w);
    //--------
    stroke("red");
    var tFlip = 1 - t;

    tCalc = easingOnT_flip_t2(t);
    point(t * w, -tCalc * w);
    tCalc = easingOnT_flip_t3(t);
    point(t * w, -tCalc * w);

    tCalc = easingOnT_flip_t4(t);
    point(t * w, -tCalc * w);
    //-------------------------
    stroke("orange");

    tCalc = t - t * t;
    point(t * w, -tCalc * w);

    tCalc = t - t * t * t;
    point(t * w, -tCalc * w);

    tCalc = t - t * t * t * t;
    point(t * w, -tCalc * w);

    tCalc = sin(t * 180);
    point(t * w, -tCalc * w);
    stroke("magenta");
    tCalc = abs(sin(t * 180 * 5));
    point(t * w, -tCalc * w);

    t += 0.001;
  }
  noLoop();
}

function tgauss(t) {
  return t - t * t * t * t;
}
