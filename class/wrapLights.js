///<reference path="../p5/intellisense/p5.global-mode.d.ts" />
/*
    tripod to hold light in order to be able to move it with journey generator 
    In p5 spotlight
*/

class MoveablePointLight extends MoveableObject {
  static defaultProperties = {
    name: 'pointLight no name',
    lit: false,
    color: [255, 200, 100],
    position: [0, 0, 700], // a bit far for default
    visible: false,
  };

  constructor(instanceProperties) {
    super();
    // add local default extension
    extendProperties(this,copyProperties(MoveablePointLight.defaultProperties));
    // apply variant if called with
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }

  // equivalent of draw , act on canvas :
  enlight() {
    if (!this.lit) return;
    var c = this.color;
    var p = this.position;
    var d = this.direction;
    pointLight(color(c), p[0], p[1], p[2]);
    if (this.visible) this.draw();
  }

  draw() {
    push();
    ambientLight(200)
    translate(
      this.position[0],
      this.position[1],
      this.position[2]
    );
    fill(color(this.color));
    noStroke();
    sphere(20);

    pop();
  }
}
/*


*/
class MoveableSpotLight extends MoveableObject {
  // specific for this level
  static defaultProperties = {
    name:"Spot Light no name",
    direction: [0, 0, -1], //  define a vector x,y,z for light direction . default for z to -z
    angle: 60, // DEGREES
    concentration: 100,
  };

  constructor(instanceProperties) {
    super();
    // add local default extension
    this.extendProperties(copyProperties(MoveableSpotLight.config));
    // apply variant if called with
    if (instanceProperties != null) this.patchProperties(instanceProperties);
  }

  enlight() {
    if (!this.lit) return;
    var c = this.color;
    var p = this.position;
    var d = this.direction;
    spotLight(color(c), p[0], p[1], p[2], d[0],d[1],d[2], this.angle, this.concentration);
    if (this.visible) this.visible();
  }

  // setData : standard
  // getData : leave standard

  logInfo() {
    super.logInfo();
    console.log(this.config); //@ todo
  }

}

