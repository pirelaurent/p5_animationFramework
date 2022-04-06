

function* europeanScript(oneTrafficLight) {
 // activate the traffic light box
 oneTrafficLight.active = true;
 let lights = oneTrafficLight.lights;
 while (true) {
   //-------- set red
   patchProperties(lights, { green: { active: false }, orange: { active: false }, red: { active: true },});
   yield lights.red.durationMs;
   //---------- set green
   patchProperties(lights, {
     green: { active: true },orange: { active: false },red: { active: false },});
   yield lights.green.durationMs;
   //---------- set orange
   patchProperties(lights, {
     green: { active: false },orange: { active: true },red: { active: false },});
   yield lights.orange.durationMs;
 } // while
}
