

function* europeanScript(oneTrafficLight) {
  var ms = 1000+random(5000);
  console.log(round(ms)+" ms to wait before activating the lights");
  yield ms
  // activate the traffic light box
  oneTrafficLight.config.active = true;
 console.log(oneTrafficLight.config.name+" start an infinite loop ");
  while (true) {
    //-------- set red 
    patchConfig(oneTrafficLight.config.lights, {
      green: { active: false },
      orange: { active: false },
      red: { active: true },
    });
     ms = 3000+random(5000)
    console.log(oneTrafficLight.config.name+" red light for "+round(ms)+" ms");
    yield ms
    //---------- set green 
    patchConfig(oneTrafficLight.config.lights, {
      green: { active: true },
      orange: { active: false },
      red: { active: false },
    });
     ms = 2000 + random(2000);
     console.log(oneTrafficLight.config.name+" green light for "+round(ms)+" ms");
    yield ms
    //---------- set orange 
    patchConfig(oneTrafficLight.config.lights, {
      green: { active: false },
      orange: { active: true },
      red: { active: false },
    });
    ms = 1000 + random(1500);
    console.log(oneTrafficLight.config.name+" orange light for "+round(ms)+" ms");
    yield ms 
  } // while
}
