///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
// global
let can;
/*
 draft done to verify independancy of components 
 Open the navigator console ( short :  Command Option I )
*/ 

var myBox1, myBox2, myBox3;
var myBowl1, myBowl2;

function setup() {
    // launch test of library with assertions to test using copyCOnfig, patchConfig, extendConfig. 
    updateTest();

  can = createCanvas(800, 800, WEBGL);





  // use default config
  myBox1 = new GraphicObject();




  // use default config and apply some change with a config inline in constructor
  myBox2 = new GraphicObject({
    name:" box2",
    stroke: { color: color(10,10,200,200)}, // in code can use also color function 
    fill: {active: true },
    position: [150, 150, 100],
    rotation: [45, 0, 0],
  });
  // use predefined variant config
  // prepare a variant config with partial update
  var typeBoxYellow = {
    name: 'yellow box',
    position: [250, 250, 100],
    stroke: { active: true, color: "yellow" },
    fill: { active: true, color: "#A0A000B0" },
  };

  // and use it later for new object of this kind
  myBox3 = new GraphicObject(typeBoxYellow);
  
  //------------- subclass
  // create an object of subClass with default
  myBowl1 = new SimpleSphere();
  // create another, but use a prepared config
  // prepare a variant partial config
  var configBowlPlus = {
    name:"bowlPlus",
    radius: 200,
    position: [0, -150, 0],
    fill: { active: true, color: [100, 100, 200, 50]},
    stroke: {color: "lightblue"}
  };
  // and use it for new object
  myBowl2 = new SimpleSphere (configBowlPlus);
  // for demo purpose set a tiny frameRate
  frameRate(2);
} // setup

function draw() {
  // play with visibility
  if (frameCount == 5) myBox1.config.visible = false;
  if (frameCount == 10) myBox1.config.visible = true;

  background(20);
  //background(pppp); //la couleur existe bien et est reconnue ici.
  myBox1.draw();
  myBox2.draw();
  myBox3.draw();
  myBowl1.draw();
  myBowl2.draw();

  // limit demo
  if (frameCount >= 20) return;

  // to prove independancies, apply some change to objects
  myBox1.config.position[0] += frameCount / 2;
  // move, rotate and enlarge box2
  myBox2.config.position[1] -= frameCount;
  myBox2.config.rotation[1] += frameCount;
  myBowl1.config.radius += frameCount;
  // change bowl2 transparency
  var coule = color(myBowl2.config.fill.color);
  coule.setAlpha(alpha(coule) + frameCount * 2);
  myBowl2.config.fill.color = coule;
  // and position 0,1,2: x,y,z
  myBowl2.config.position[2] -= frameCount * 4;
  myBowl2.config.position[0] -= frameCount;
  // change scale 
  myBowl2.config.scale[0]*=0.95;
}


