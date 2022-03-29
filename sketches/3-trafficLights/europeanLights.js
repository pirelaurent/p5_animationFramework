

function* europeanScript(oneTrafficLight) {
 // activate the traffic light box
 oneTrafficLight.config.active = true;
 let lights = oneTrafficLight.config.lights;
 while (true) {
   //-------- set red
   patchConfig(lights, { green: { active: false }, orange: { active: false }, red: { active: true },});
   yield lights.red.durationMs;
   //---------- set green
   patchConfig(lights, {
     green: { active: true },orange: { active: false },red: { active: false },});
   yield lights.green.durationMs;
   //---------- set orange
   patchConfig(lights, {
     green: { active: false },orange: { active: true },red: { active: false },});
   yield lights.orange.durationMs;
 } // while
}
