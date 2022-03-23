//-------------- sample of dérivation : add config option radius, overwrite drawModel
class SimpleSphere extends GraphicObject {
  // Default config of this level
  static config = {
    // a new property
    radius: 100,
    // some change to default
    stroke: { weight: 0.2 },
  };

  // // let do the job of super
  constructor(instanceConfigVariant) {
    // get parent config in this.config without applying variant 
    super();
    // add local default extension
    this.extendConfig(copyConfig(SimpleSphere.config))
    // apply variant if called with
    if(instanceConfigVariant != null ) this.patchConfig(instanceConfigVariant)
  }

  // overWrite for model
  drawModel() {
    sphere(this.config.radius);
  }
}
