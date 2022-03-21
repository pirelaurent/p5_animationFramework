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
  constructor() {
    this.visible = true;
    this.active = false; // lights stay all grey
    this.lights = {
      green: { active: false, colors: { on: "#3ADF00", off: "#243B0B" } },
      orange: { active: false, colors: { on: "#FFBF00", off: "#61380B" } },
      red: { active: false, colors: { on: "#FF0000", off: "#3B0B0B" } },
    };
  }

  // draw at current place
  draw() {
    if (!this.visible) return;
    push(); // protect others
    this.drawHousing();
    // add three lights sphere
    noStroke();
    translate(0, 50, 20);
    this.drawLight("green");
    translate(0, -50, 0);
    this.drawLight("orange");
    translate(0, -50, 0);
    this.drawLight("red");
    pop();
  }
  // draw the named light
  drawLight(name) {
    let opt = this.lights[name];
    if (opt.active && this.active) fill(opt.colors.on);
    else fill(opt.colors.off);
    sphere(20);
  }

  drawHousing() {
    // draw a box with a pole
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
// start the scenario, create it if necessary 
 startEuropeanScenario(){
    if (!this.europeanScenario) this.europeanScenario = 
       new Scenario({name: "internal", trace: true}, this.europeanInternalScript.bind(this))
    this.europeanScenario.start();
}

// enhancement add the script internal 
* europeanInternalScript() {
    console.log("1_tuto: start an internal script ");
    // activate the traffic light box
    this.active = true;
    console.log("1_tuto: start an infinite loop ");
    console.log(this.lights);
    while (true) {
      console.log("1_tuto: red light for 7 s");
      patchConfig(this.lights, { green: { active: false }, orange: { active: false }, red: { active: true }});
      yield 7000;
      console.log("1_tuto: green light for 5 s");
      patchConfig(this.lights, {green: { active: true },orange: { active: false },red: { active: false }});
      yield 5000;
      console.log("1_tuto: orange light for 2 s");
      patchConfig(this.lights, {green: { active: false },orange: { active: true },red: { active: false }});
      yield 2000;
    } // while
  }
}
