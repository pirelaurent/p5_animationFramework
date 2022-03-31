///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
var camera1, tripod1;

//  ----- to see bezier
var ball;
var masterScenario;
var scenario_bz;
var scenario_bzSpecial;
var travelling;

function preload() {}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  // create camera and a tripod to hold it
  camera1 = createCamera();
  camera1.move(0,-100,200);
 // preSet kb helper to see grid and be able to move ball with keyboard 
 kb.showGrid = true;


  // something to move : a ball with a radius parameter in config 
  ball = new SimpleSphere({
    name: "ball",
    fill: { active: true, color: "magenta" },
    stroke: { active: true, color: "white" },
    radius: 30,
  });
  kb.objectsToMove.push(ball); // slot 0
  
  // prepare two scenario for examples . Go, inflate, return 
  scenario_bz = new Scenario({ scenarioName: "movement bezier", trace: true }, [
    { scriptName: " ball move",   generator: scriptJourney,arguments: [outWardJourney, ball],   },
    { scriptName: " inflate ball", generator: scriptInflateBall   },
    {      scriptName: " ball move back", generator: scriptJourney, arguments: [returnJourney, ball],    },
  ]);

  // same Go, inflate, return  out of 0..1 Bezier curve 
  scenario_bzSpecial = new Scenario(
    { scenarioName: "special bezier", trace: true },[
      { scriptName: " ball move", generator: scriptJourney, arguments: [outWardJourneySpecial, ball],
      },
      { scriptName: " inflate ball", generator: scriptInflateBall },
      { scriptName: " ball move back", generator: scriptJourney,arguments: [returnJourneySpecial, ball], },
    ]
  );

  // generator for master scenario
  function* startAll() {
    console.log('----- Bezier trajectory from start to end, inflate, then  return ----')
    scenario_bz.start();
    // wait end of previous 
    yield scenario_bz.durationMs;
    // in case some timing difference , verify 
    while (!scenario_bz.isEnded) yield 50;
    console.log('----- Bezier trajectory out of scope 0..1 using start & end, inflate, then return ----')
    scenario_bzSpecial.start();
  }

  masterScenario = new Scenario({ scenarioName: "master", trace: true }, 
  [  { scriptName: "start all", generator: startAll} ]);
  // run animations 
  masterScenario.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(140);
  kbHelp();
  ball.draw();
}
//--------------- reuse a common travel for several journeys --------
var travel = {
  name: "position",
  start: [250, -160, -60],
  end: [-220, 10, -290],
  bezier: {
    inter1: [-190, 370, 240],
    inter2: [-50, -460, -480],
  },
};
//-------- standard behavior from start to end 
var travel1 = copyConfig(travel);
var outWardJourney = { duration_ms: 10000, parameters: [travel1]};

// return journey using a reverse estimated time 
// while going back we change some aspects with other parameters 
var travel2 = copyConfig(travel);
travel2.easingOnT= (t) => 1 - t;
var returnJourney = { duration_ms: 10000, 
  parameters: [ 
    travel2,
    { name: "radius", end: 30,},
    { name: "fill.color", end: [50, 50, 200] },
  ],
};

// reuse position movement and use Bezier out of range 0..1 from -0.2 to 1.2  
var travelSpecial1 = copyConfig(travel);
travelSpecial1.easingOnT = (t) => -0.2 + (1.2+0.2) * t;

// same as above but travel back by 1- f(t)  
var travelSpecial2 = copyConfig(travel);
travelSpecial2.easingOnT = (t) => 1 - (-0.2 + 1.4 * t);

var outWardJourneySpecial = {
  duration_ms: 10000, // duration of the journey
  parameters: [travelSpecial1],
};

// to get back on the exact same trajectory, don't change data, just add an easingOnT reverse
var returnJourneySpecial = {
  duration_ms: 10000, // duration of the journey
  parameters: [
    travelSpecial2,
    // while going back  change some visual aspects
    { name: "radius", end: 30 },
    { name: "fill.color", end: [50, 50, 200] },
  ],
};

// not only journey and sriptjourney:  can also change everything by code in a generator 
function* scriptInflateBall() {
  // change color
  ball.config.fill.color = [0, 255, 0];
  // inflate the ball
  while (ball.config.radius < 50) {
    ball.config.radius += 1;
    yield 100;
  }
}