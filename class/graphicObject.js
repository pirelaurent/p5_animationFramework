/*
 four classes to work with: 
 - BasicObject is a common class to hold properties as Literal and some functions to work with.
 - MoveableObject dry ancester with position, rotation , scale and a draw method
  (note: rotation will uses the current angleMode. It's up to you to give right values)
 GraphicObject  a moveable object with colors and stroke 
 GraphicObjectModel a GraphicObject with optional .obj and texture 
*/



class BasicObject{
  // the config will create new properties into the class 
  static defaultProperties ={
    name: "BasicObject no name"
  }
  constructor(instanceProperties) {
    extendProperties(this,copyProperties(BasicObject.defaultProperties));
    // apply variant if constructor was called with some parameters.
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }


  // local relay to get or set values using dot path
  getData(someDotPath) {
    return getProperties(this, someDotPath);
  }

  setData(someDotPath, newValue) {
    setProperties(this, someDotPath, newValue);
  }
}



// ------------------- sample object to move
class MoveableObject extends BasicObject{
  // Default config of this level
  static defaultProperties = {
    name: "moveableObject no name", // to facilitate debug, give a name to your objects
    position: [0, 0, 0], // current location of object to draw it
    angleMode: null,  // what's the unit of angle . If not set use current angleMode 
    rotation: [0, 0, 0], // current rotation of object. order is: rotateX, then Y , then Z
    scale: [1, 1, 1], // optional scale in the 3 directions
  };

  constructor(instanceProperties) {
    super();
    extendProperties(this,copyProperties(MoveableObject.defaultProperties));
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }
  
  // locate relative to current position . If protected everywhere must be 0,0,0 
  locate(){
    let pos = this.position;
    translate(pos[0], pos[1], pos[2]);
  }

  rotate(){
    var pushPopAngleMode; // p5 don't push/pop angleMode 
    if(this.angleMode!=null){
     pushPopAngleMode = _angleMode;
     angleMode(this.angleMode);
    }
    let rot = this.rotation;
    rotateX(rot[0]);
    rotateY(rot[1]);
    rotateZ(rot[2]);
    if(this.angleMode!=null){
     angleMode(pushPopAngleMode);
    }
  }

  movePosition([x, y, z]) {
    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
  }

  moveRotation([x, y, z]) {
    this.rotation[0] += x;
    this.rotation[1] += y;
    this.rotation[2] += z;
  }

  logInfo(){
    console.log(`${this.name}:`);
    console.log(` position : [${this.position.toString()}]`);
    console.log(` rotation : [${this.rotation.toString()}]`);
  }
}

/*
 A moveable object which is able to draw itself 
*/
class GraphicObject extends MoveableObject {
  // Default config of this level
  static defaultProperties = {
    name: "graphicObject no name ", // to facilitate debug, give a name to your objects
    // screen drawing
    visible: true, // if false, object is not drawn
    stroke: { active: true, color: "white", weight: 1 },
    fill: { active: true, color: [200, 100, 100, 200] },
  };

  constructor(instanceProperties) {
    super();
    // add local default extension
    extendProperties(this,copyProperties(GraphicObject.defaultProperties));
    // apply variant if called with
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }

  // use the config to draw in p5 visual code
  draw() {
    // nothing to do if not visible
    if (!this.visible) return;
    push();
    // locate
    this.locate();
    // rotate
    this.rotate();
    // scale
    let scalexyz = this.scale;
    scale(scalexyz[0], scalexyz[1], scalexyz[2]);
    // display painting 
    if (this.stroke.active) {
      stroke(this.stroke.color);
      strokeWeight(this.stroke.weight);
    } else noStroke();
    //
    if (this.fill.active) {
      fill(color(this.fill.color));
    } else noFill();

    // draw the default shape (here a box) . to be overwritten by any
    if (this.drawModel != null) this.drawModel();
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
  static defaultProperties = {
    model: null, // the shape to draw
    texture: { active:false, image: null } // optional texture
  };
  constructor(instanceProperties) {
    super();  // will have created part of the config under ancester responsibility
    // extend with a copy of local default config
    extendProperties(this,copyProperties(GraphicObjectModel.defaultProperties));
    // apply variant if called with
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }
  // overWritten methods
  drawModel() {
    if (this.texture.active) texture(this.texture.image);
    model(this.model);
  }
}


