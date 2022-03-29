///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
var camera1, tripod1;

//  ----- to see bezier
var ball;
var scenario_bz;
var travelling;

function preload() {}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  // create camera and a tripod to hold it
  camera1 = createCamera();
  tripod1 = new Tripod({
    name: "tripod 1",
    position: [0, -120, 700], // point of view to see the grid
  });
  tripod1.mountCamera(camera1);

  // something to move
  ball = new SimpleSphere({
    name: "ball",
    fill: { active: true, color: "magenta" },
    stroke: { active: true, color: "white" },
    radius: 30,
  });

  scenario_bz = new Scenario({ scenarioName: "movement bezier", trace: true }, [
    { scriptName: " ball move", generator: scriptJourney, arguments: [aJourneyBezier, ball] },
    { scriptName: " ball change", generator: scriptBall },
    {
      scriptName: " ball move back",
      generator: scriptJourney, arguments:[aJourneyBezierBack, ball],
    },
  ]);

  travelling = new Scenario(
    { scenarioName: " travelling bezier", trace: true },
    [
      {
        scriptName: " travelling",
        generator: scriptJourney, arguments : [travellingBezier, tripod1],
      },
    ]
  );

  // prepare kb helper with axes and grid

  kb.showGrid = true;
  kb.objectsToMove.push(ball); // slot 0
  kb.objectsToMove.push(tripod1); // slot 1

  // run scenario
  scenario_bz.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(140);
  kbHelp();
  ball.draw();
}

var aJourneyBezier = {
  duration_ms: 10000, // duration of the journey
  parameters: [
    {
      name: "position",
      start: [250, -160, -60],
      end: [-220, 10, -290],
      bezier: {
        inter1: [-190, 370, 240],
        inter2: [-50, -460, -480],
      },
    },
  ],
};

// to get back on the exact same trajectory, don't change data, just add an easingOnT reverse
var aJourneyBezierBack = {
  duration_ms: 10000, // duration of the journey
  parameters: [
    {
      name: "position",
      start: [250, -160, -60],
      end: [-220, 10, -290],
      bezier: {
        inter1: [-190, 370, 240],
        inter2: [-50, -460, -480],
      },
      easingOnT: (t) => 1 - t,
    },
    // while going back we change some aspects
    {
      name: "radius",
      end: 30,
    },
    { name: "fill.color", end: [50, 50, 200] },
  ],
};

// generator : can also change everything by code
function* scriptBall() {
  // wait a bit
  yield 1000;
  // change color
  ball.config.fill.color = [0, 255, 0];
  // inflate the ball
  while (ball.config.radius < 100) {
    ball.config.radius += 1;
    yield 100;
  }
  // then change stroke
  ball.config.stroke.color = "black";
  travelling.start();
}

var travellingBezier = {
  duration_ms: 10000, // duration of the journey
  parameters: [
    {
      name: "position",
      start: [220, -280, 320],
      end: [-270, -280, -170],
      bezier: {
        inter1: [40, -160, -310],
        inter2: [-430, -250, 520],
      },
    },
  ],
};
