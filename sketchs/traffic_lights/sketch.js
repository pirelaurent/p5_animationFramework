

var traffic_1, europeanScenario1;
var traffic_2, europeanScenario2;
var traffic_3
var traffic_4


function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.position(0, 0);
  traffic_1 = new TrafficLight("pole 1");
  traffic_2 = new TrafficLight("pole 2");
  traffic_3 = new TrafficLight("pole 3");
  traffic_4 = new TrafficLight("pole 4");
// external scenarios
   europeanScenario1 = new Scenario(
    { scenarioName: "european lights 1", trace: true },
    { scriptName: " lights 1", generator: europeanScript, arguments: [traffic_1] });
   europeanScenario2 = new Scenario(
    { scenarioName: "european lights 2", trace: true },
    { scriptName: " lights 2", generator: europeanScript, arguments: [traffic_2] });
// start all 
  europeanScenario1.start();
  europeanScenario2.start();
  traffic_3.lightsScenario.start();
  traffic_4.lightsScenarioBis.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(60);
  translate(-150, -100, 0);
  traffic_1.draw();
  translate(100, 0, 0);
  traffic_2.draw();
  translate(100, 0, 0);
  traffic_3.draw();
  translate(100, 0, 0);
  traffic_4.draw();

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
    if (!traffic_4.lightsScenario.isEnded) {
      traffic_4.lightsScenario.stop();
      traffic_4.config.active = false;
    }
  }
}
