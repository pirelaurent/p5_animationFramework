

// ------------------- sample object to draw
class SimpleObject {
  // Default config of this level 
  static config = {
    name: "no name", // to facilitate debug, give a name to your objects
    visible: true, // if false object is not drawn
    position: [0, 0, 0], // current location of object
    rotation: [0, 0, 0], // ( degrees )current rotation of object. order is rotateX,then Y , then Z
    scale: [1, 1, 1], // optional scale in the 3 directions
    // design
    stroke: { active: true, color: "white", weight: 1 },
    //fill: { active: false, color: "grey" },
    fill: { active: false, color: [200,100,200]}
  
  };  

  constructor(instanceConfigVariant) {
    this.extendConfig(copyConfig(SimpleObject.config))
    // apply variant if constructor was called with 
    if(instanceConfigVariant != null ) this.patchConfig(instanceConfigVariant)
  }
   
 // local relay to util lib
 patchConfig(someModifier){
  this.config = patchConfig(this.config,someModifier)
 }

 extendConfig(someExtent){
   if (this.config==null) this.config ={}
  this.config = extendConfig(this.config,someExtent)
 }

  // use the config
  draw() {
    // nothing to do if not visible
    if (!this.config.visible) return;
    // apply config
    push();
    // locate
    let pos = this.config.position;
    translate(pos[0], pos[1], pos[2]);
    // rotate
    let rot = this.config.rotation;
    angleMode(DEGREES);
    if (rot[0]) rotateX(rot[0]);
    if (rot[1]) rotateY(rot[1]);
    if (rot[2]) rotateZ(rot[2]);
    // scale
    let scalexyz = this.config.scale;
    scale(scalexyz[0], scalexyz[1], scalexyz[2]);
    // display
    if (this.config.stroke.active){
        stroke(this.config.stroke.color);
        strokeWeight(this.config.stroke.weight)
    } else noStroke();
    //
    if(this.config.fill.active){
        fill(color(this.config.fill.color));
    } else noFill();

    // draw the default shape (here a box) . to be overwritten by any
    this.drawModel();
    pop();
  }
  // to be overwriten . for test purpose draw a box
  drawModel() {
    box(100, 100, 100);
  }
}
