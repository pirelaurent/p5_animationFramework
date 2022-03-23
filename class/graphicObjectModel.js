/*
 this class associates a 'model' to the base oject. 
 A 'model' can comes 
 - from a 'loadModel for an .obj or .stl file' 
 - from a GeometryObject designed by hand 

 The construction must be done in two times : 
  - construct the object skeleton 
  - associate a 'model' to the object 

This choice has been made : 
- to load the models in the preload part of p5 sketch (and avoid reentrancy pb with loadmodel elsewhere)
- to be able to associate one same model to several instances without loading several models

Same principle is retained for loading textures : 
- load outside 
- associate 
*/

class GraphicObjectModel extends GraphicObject {
  static config = {
    model: null, // the shape to draw
    texture: { active:false, image: null } // optional texture
  };
  constructor(instanceConfigVariant) {
    super();  
    // add local default extension
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
