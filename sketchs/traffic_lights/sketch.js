var traffic_1, europeanScenario1;
var traffic_2, europeanScenario2;
var traffic_3;
var traffic_4;

var masterScenario;
var cam;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.position(0, 0);
  cam = createCamera();
  cam.move(0, -200, 0);

  traffic_1 = new TrafficLight("pole 1");
  traffic_2 = new TrafficLight("pole 2");
  traffic_3 = new TrafficLight("pole 3");
  traffic_4 = new TrafficLight("pole 4");
  // external scenarios
  europeanScenario1 = new Scenario(
    { scenarioName: "european lights 1", trace: true },
    {
      scriptName: " lights 1",
      generator: europeanScript,
      arguments: [traffic_1],
    }
  );
  europeanScenario2 = new Scenario(
    { scenarioName: "european lights 2", trace: true },
    {
      scriptName: " lights 2",
      generator: europeanScript,
      arguments: [traffic_2],
    }
  );
  // a general scenario to  synchonized the both sides of the road 
  masterScenario = new Scenario(
    { scenarioName: "master", trace: true },
    { scriptName: " launcher", generator: launchScript }
  );
  // start all vi master
  masterScenario.start();

  // ground help
  kb.showGrid = true;
}

function draw() {
  orbitControl(1, 1, 1);
  background(90);
  kbHelp(); // some help with keyboard key and console
  push();
    translate(-250, -100, 0);
    rotateY(radians(-90));
    traffic_1.draw();
  pop();
  push();
    translate(250, -100, -300);
    rotateY(radians(90));
    traffic_2.draw();
  pop();
  push();
    translate(-250, -100, -300);
    rotateY(radians(-222));
    traffic_3.draw();
  pop();
  push();
    translate(250, -100, 0);
    rotateY(radians(-10));
    traffic_4.draw();
  pop();

  // the scenarios run for ever. We stop it after some time to conclude this tuto
  if (millis() > 60000) {
    if (!europeanScenario1.isEnded) {
      europeanScenario1.stop();
      traffic_1.config.active = false;
    }
  }

  if (millis() > 70000) {
    if (!europeanScenario2.isEnded) {
      europeanScenario2.stop();
      traffic_2.config.active = false;
    }
  }
  if (millis() > 80000) {
    if (!traffic_3.lightsScenario.isEnded) {
      traffic_3.lightsScenario.stop();
      traffic_3.config.active = false;
    }
  }
  if (millis() > 100000) {
    if (!traffic_4.lightsScenarioBis.isEnded) {
      traffic_4.lightsScenarioBis.stop();
      traffic_4.config.active = false;
    }
  }
}


// Master scenarion script : starts a pair of traffic_lights then a second pair 
function* launchScript() {
  europeanScenario1.start();
  europeanScenario2.start();
  // a light starts with red for 4000 . wait this amount then start the other pair
  yield 4000;
  traffic_3.lightsScenario.start();
  traffic_4.lightsScenarioBis.start();
}
