///<reference path="../p5/intellisense/p5.global-mode.d.ts" />
/*
    tripod to hold light in order to be able to move it with journey generator 
    In p5 spotlight
*/

class MoveablePointLight extends MoveableObject {
  static config = {
    name: 'pointLight no name',
    visible: false,
    color: [255, 200, 100],
    position: [0, 0, 700], // a bit far for default
    showMe: false,
  };

  constructor(instanceConfigVariant) {
    super();
    // add local default extension
    this.extendConfig(copyConfig(MoveablePointLight.config));
    // apply variant if called with
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }

  // equivalent of draw , act on canvas :
  enlight() {
    if (!this.config.visible) return;
    var c = this.config.color;
    var p = this.config.position;
    var d = this.config.direction;
    pointLight(color(c), p[0], p[1], p[2]);
    if (this.config.showMe) this.showMe();
  }

  showMe() {
    push();
    ambientLight(200)
    translate(
      this.config.position[0],
      this.config.position[1],
      this.config.position[2]
    );
    fill(color(this.config.color));
    noStroke();
    sphere(20);

    pop();
  }
}
/*


*/
class MoveableSpotLight extends MoveableObject {
  // specific for this level
  static config = {
    name:"Spot Light no name",
    direction: [0, 0, -1], //  define a vector x,y,z for light direction . default for z to -z
    angle: 60, // DEGREES
    concentration: 100,
  };

  constructor(instanceConfigVariant) {
    super();
    // add local default extension
    this.extendConfig(copyConfig(MoveableSpotLight.config));
    // apply variant if called with
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }

  enlight() {
    if (!this.config.visible) return;
    var c = this.config.color;
    var p = this.config.position;
    var d = this.config.direction;
    spotLight(color(c), p[0], p[1], p[2], d[0],d[1],d[2], this.config.angle, this.config.concentration);
    if (this.config.showMe) this.showMe();
  }

  // setData : standard
  // getData : leave standard

  logInfo() {
    super.logInfo();
    console.log(this.config); //@ todo
  }

}

