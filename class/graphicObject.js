/*
 Three classes to work with: 

 MoveableObject dry ancester with position and rotation 
  note: rotation will uses the current angleMode. It's up to you to give right values
 GraphicObject  a moveable object with colors and stroke 
 GraphicObjectModel a GraphicObject with optional .obj and texture 
 
*/

// ------------------- sample object to move
class MoveableObject {
  // Default config of this level
  static config = {
    name: "moveableObject no name", // to facilitate debug, give a name to your objects
    position: [0, 0, 0], // current location of object to draw it
    angleMode: null,  // what's the unit of angle . If not set use current angleMode 
    rotation: [0, 0, 0], // current rotation of object. order is: rotateX, then Y , then Z
    scale: [1, 1, 1], // optional scale in the 3 directions
  };

  constructor(instanceConfigVariant) {
    this.config = copyConfig(MoveableObject.config);
    // apply variant if constructor was called with some parameters.
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }

  // local relay to simplify coding
  patchConfig(someModifier) {
    this.config = patchConfig(this.config, someModifier);
  }

  extendConfig(someExtent) {
    this.config = extendConfig(this.config, someExtent);
  }
  // local relay to get or set values using dot path
  getData(someDotPath) {
    return getDataConfig(this.config, someDotPath);
  }

  setData(someDotPath, newValue) {
    setDataConfig(this.config, someDotPath, newValue);
  }
  // locate relative to current position . If protected everywhere must be 0,0,0 
  locate(){
    let pos = this.config.position;
    translate(pos[0], pos[1], pos[2]);
  }

  rotate(){
    var pushPopAngleMode; // p5 don't push/pop angleMode 
    if(this.config.angleMode!=null){
     pushPopAngleMode = _angleMode;
     angleMode(this.config.angleMode);
    }
    let rot = this.config.rotation;
    rotateX(rot[0]);
    rotateY(rot[1]);
    rotateZ(rot[2]);
    if(this.config.angleMode!=null){
     angleMode(pushPopAngleMode);
    }
  }

  movePosition([x, y, z]) {
    this.config.position[0] += x;
    this.config.position[1] += y;
    this.config.position[2] += z;
  }

  moveRotation([x, y, z]) {
    this.config.rotation[0] += x;
    this.config.rotation[1] += y;
    this.config.rotation[2] += z;
  }

  logInfo(){
    console.log(`${this.config.name}:`);
    console.log(` position : [${this.config.position.toString()}]`);
    console.log(` rotation : [${this.config.rotation.toString()}]`);
  }
}

/*
 A moveable object which is able to draw itself 
*/
class GraphicObject extends MoveableObject {
  // Default config of this level
  static config = {
    name: "graphicObject no name ", // to facilitate debug, give a name to your objects
    visible: true, // if false, object is not drawn
    // screen drawing
    stroke: { active: true, color: "white", weight: 1 },
    fill: { active: true, color: [200, 100, 100, 200] },
  };

  constructor(instanceConfigVariant) {
    super();
    // add local default extension
    this.extendConfig(copyConfig(GraphicObject.config));
    // apply variant if called with
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }

  // use the config to draw in p5 visual code
  draw() {
    // nothing to do if not visible
    if (!this.config.visible) return;
    push();
    // locate
    this.locate();
    // rotate
    this.rotate();
    // scale
    let scalexyz = this.config.scale;
    scale(scalexyz[0], scalexyz[1], scalexyz[2]);
    // display painting 
    if (this.config.stroke.active) {
      stroke(this.config.stroke.color);
      strokeWeight(this.config.stroke.weight);
    } else noStroke();
    //
    if (this.config.fill.active) {
      fill(color(this.config.fill.color));
    } else noFill();

    // draw the default shape (here a box) . to be overwritten by any
    if (this.config.drawModel != null) this.config.drawModel();
    else this.drawModel();
    pop();
  }

  //to be overwriten . for test purpose draw a box
  drawModel() {
    box(100, 150, 50);
  }
}

/*
 this class associates a 'model' to the base oject. 
 A 'model' can comes 
 - from a 'loadModel for an .obj or .stl file' 
 - from a GeometryObject designed by hand 
 A 'texture' can also be set 
 
 In p5 some pb can occurs if loadModel is outside of preload. 
 Our advice : 
  - code all loadModel and loadImage for texure in preload 
  - construct GraphicsObject in setup 

*/

class GraphicObjectModel extends GraphicObject {
  static config = {
    model: null, // the shape to draw
    texture: { active:false, image: null } // optional texture
  };
  constructor(instanceConfigVariant) {
    super();  // will have created part of the config under ancester responsibility
    // extend with a copy of local default config
    this.extendConfig(copyConfig(GraphicObjectModel.config));
    // apply variant if called with
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }
  // overWritten methods
  drawModel() {
    if (this.config.texture.active) texture(this.config.texture.image);
    model(this.config.model);
  }
}


