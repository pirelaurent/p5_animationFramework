var europeanScenario = new Scenario(
  {
    name: "european lights",
    trace: true,
  },
  europeanScript
);

function* europeanScript() {
  console.log(" tuto: 2 seconds to wait before activating the lights");
  yield 2000;
  // activate the traffic light box
  traffic_0.active = true;
  console.log("0_tuto: start an infinite loop ");
  while (true) {
    console.log("0_tuto: red light for 8 s");
    patchConfig(traffic_0.lights, { green: { active: false }, orange: { active: false }, red: { active: true }});
    yield 8000;
    console.log("0_tuto: green light for 5 s");
    patchConfig(traffic_0.lights, {green: { active: true },orange: { active: false },red: { active: false }});
    yield 5000;
    console.log("0_tuto: orange light for 2 s");
    patchConfig(traffic_0.lights, {green: { active: false },orange: { active: true },red: { active: false }});
    yield 2000;
  } // while
}

function* europeanScriptWithParameter(oneTrafficLight) {
    console.log(" tuto: 2 seconds to wait before activating the lights");
    yield 2000;
    // activate the traffic light box
    oneTrafficLight.active = true;
    console.log("2_tuto: start an infinite loop ");
    while (true) {
      console.log("2_tuto: red light for random s");
      patchConfig(oneTrafficLight.lights, { green: { active: false }, orange: { active: false }, red: { active: true }});
      yield 3000+random(5000);
      console.log("2_tuto: green light for random s");
      patchConfig(oneTrafficLight.lights, {green: { active: true },orange: { active: false },red: { active: false }});
      yield 2000+random(2000);
      console.log("2_tuto: orange light for random s");
      patchConfig(oneTrafficLight.lights, {green: { active: false },orange: { active: true },red: { active: false }});
      yield 1000+ random(2000);
    } // while
  }