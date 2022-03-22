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
        green: { active: false, colors: { on: "#3ADF00", off: "#243B0B" } },
        orange: { active: false, colors: { on: "#FFBF00", off: "#61380B" } },
        red: { active: false, colors: { on: "#FF0000", off: "#3B0B0B" } },
      },
    };
    //add on in constructor for example traffic_3 
    this.lightsScenario = new Scenario(
      { scenarioName: "lightsScenario", trace: true },
      { scriptName: "european ligths", instance: this.internalEuropeanScript(this)}
    );
    //add on in constructor for example traffic_4 
      this._internalEuropeanScript_.bind(this);
      this.lightsScenarioBis = new Scenario(
        { scenarioName: "lightsScenarioBis", trace: true },
        { scriptName: "european ligths Bis", instance: this._internalEuropeanScript_()}
      );
  }

  // draw at current place
  draw() {
    if (!this.config.visible) return;
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
  drawLight(colorName) {
    let opt = this.config.lights[colorName];
    if (opt.active && this.config.active) fill(opt.colors.on);
    else fill(opt.colors.off);
    sphere(20);
  }

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
    var ms = 1000 + random(5000);
    console.log(round(ms) + " ms to wait before activating the lights");
    yield ms;
    // activate the traffic light box
    oneTrafficLight.config.active = true;
    console.log(oneTrafficLight.config.name + " start an infinite loop ");
    while (true) {
      //-------- set red
      patchConfig(oneTrafficLight.config.lights, {
        green: { active: false },
        orange: { active: false },
        red: { active: true },
      });
      ms = 3000 + random(5000);
      console.log(
        oneTrafficLight.config.name + " green light for " + round(ms) + " ms"
      );
      yield ms;
      //---------- set green
      patchConfig(oneTrafficLight.config.lights, {
        green: { active: true },
        orange: { active: false },
        red: { active: false },
      });
      ms = 2000 + random(2000);
      console.log(
        oneTrafficLight.config.name + " green light for " + round(ms) + " ms"
      );
      yield ms;
      //---------- set orange

      patchConfig(oneTrafficLight.config.lights, {
        green: { active: false },
        orange: { active: true },
        red: { active: false },
      });
      ms = 1000 + random(1500);
      console.log(
        oneTrafficLight.config.name + " orange light for " + round(ms) + " ms"
      );
      yield ms;
    } // while
  }

  /*
 another way is to use 'this' inside the script in place of oneTrafficLight parameter.
*/
  * _internalEuropeanScript_() {
    var ms = 1000 + random(5000);
    console.log(
      this.config.name +
        " " +
        round(ms) +
        " ms to wait before activating the lights"
    );
    yield ms;
    // activate the traffic light box
    this.config.active = true;
    console.log(this.config.name + " start an infinite loop ");
    while (true) {
      //-------- set red
      patchConfig(this.config.lights, {
        green: { active: false },
        orange: { active: false },
        red: { active: true },
      });
      ms = 3000 + random(5000);
      console.log(this.config.name + " green light for " + round(ms) + " ms");
      yield ms;
      //---------- set green
      patchConfig(this.config.lights, {
        green: { active: true },
        orange: { active: false },
        red: { active: false },
      });
      ms = 2000 + random(2000);
      console.log(this.config.name + " green light for " + round(ms) + " ms");
      yield ms;
      //---------- set orange
      patchConfig(this.config.lights, {
        green: { active: false },
        orange: { active: true },
        red: { active: false },
      });
      ms = 1000 + random(1500);
      console.log(this.config.name + " orange light for " + round(ms) + " ms");
      yield ms;
    } // while
  }
}
