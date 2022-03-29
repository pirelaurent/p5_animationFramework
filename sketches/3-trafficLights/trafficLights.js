///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
/*
 a simple class for demo : a traffic light model done of : 
 - a rectangular box 
 - 3 lights green, orange, red 
 - a pole 
 - a draw function 
*/

class TrafficLight {
  constructor(name) {
    this.config = {
      name: name,
      visible: true,
      active: false, // lights stay all grey
      lights: {
        green: { active: false, colors: { on: "#3ADF00", off: "#243B0B" }, durationMs: 3000 },
        orange: { active: false, colors: { on: "#FFBF00", off: "#61380B" }, durationMs: 1000 },
        red: { active: false, colors: { on: "#FF0000", off: "#3B0B0B" }, durationMs: 4000 },
      },
    };
    //add on for example traffic_3 
    this.lightsScenario = new Scenario(
      { scenarioName: "lightsScenario3", trace: true },
      { scriptName: "european ligths 3", generator: this.internalEuropeanScript, arguments:[this]}
    );
    //add on for example traffic_4 
      this.lightsScenarioBis = new Scenario(
        { scenarioName: "lightsScenario4", trace: true },
        { scriptName: "european ligths 4", generator: this._internalEuropeanScript_.bind(this)}
      );
  }

  // draw at current place
  draw() {
    if (!this.config.visible) return;
    push(); // protect others
    this.drawHousing();
    // add three lights bulbs
    noStroke();
    translate(0, 50, 20);this.drawLight("green");
    translate(0, -50, 0);this.drawLight("orange");
    translate(0, -50, 0);this.drawLight("red");
    pop();
  }
  // draw the colored bulb
  drawLight(colorName) {
    let opt = this.config.lights[colorName];
    if (opt.active && this.config.active) fill(opt.colors.on);
    else fill(opt.colors.off);
    sphere(20);
  }g

  // draw a box with a pole
  drawHousing() {
    push();
    fill(30);
    stroke("black");
    box(50, 150, 40);
    noStroke();
    // pole under
    fill(20);
    translate(0, 150, 0);
    cylinder(10, 250);
    pop();
  }

  /*
  embedded scenario example : 
  the generator is now an internal method of object 
  we reuse a script with a parameter and give 'this' as parameter  
*/

  *internalEuropeanScript(oneTrafficLight) {
    // activate the traffic light box
    oneTrafficLight.config.active = true;
    let lights = oneTrafficLight.config.lights;
    while (true) {
      //-------- set red
      patchConfig(lights, {
        green: { active: false },
        orange: { active: false },
        red: { active: true },
      });
      yield lights.red.durationMs;
      //---------- set green
      patchConfig(lights, {
        green: { active: true },
        orange: { active: false },
        red: { active: false },
      });
      yield lights.green.durationMs;
      //---------- set orange
      patchConfig(lights, {
        green: { active: false },
        orange: { active: true },
        red: { active: false },
      });
      yield lights.orange.durationMs;
    } // while
  }

  /*
 another way is to use 'this' inside the script in place of oneTrafficLight parameter.
*/
  * _internalEuropeanScript_() {
    // activate the traffic light box
    this.config.active = true;
    let lights = this.config.lights;
    while (true) {  // infinite loop 
      //-------- set red
      patchConfig(this.config.lights, {
        green: { active: false },
        orange: { active: false },
        red: { active: true },
      });
      yield lights.red.durationMs;
      //---------- set green
      patchConfig(this.config.lights, {
        green: { active: true },
        orange: { active: false },
        red: { active: false },
      });
      yield lights.green.durationMs;
      //---------- set orange
      patchConfig(this.config.lights, {
        green: { active: false },
        orange: { active: true },
        red: { active: false },
      });
      yield lights.orange.durationMs;
    } // while
  }
}
