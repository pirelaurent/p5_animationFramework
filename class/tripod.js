/*
    tripod to hold a camera 
    In p5 a camera has a position to be (eye) and a position to look at(center)
*/

class Tripod extends MoveAbleObject {
  // specific for this level
  static config = {
    position: [0,0,700],   // replace the default [0,0,0] to see something 
    lookAt: [0, 0, 0],     // new property 
  };
  
  constructor(instanceConfigVariant) {
    super();
    this.extendConfig(copyConfig(Tripod.config));
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }

  /*
   mounting a camera on a tripod will give the camera the tripod position 
  */
  mountCamera(someCamera) {
    this.config.camera = someCamera;
    this.refreshCameraPosition();
  }
  /*
   mountUnderCamera  : the tripod will take the current camera values 
  */
  mountUnderCamera(someCamera) {
    this.config.camera = someCamera;
    let cam = this.config.camera;
    let lookAt = this.config.lookAt;
    lookAt[0] = cam.centerX;
    lookAt[1] = cam.centerY;
    lookAt[2] = cam.centerZ;
    let pos = this.config.position;
    pos[0] = cam.eyeX;
    pos[1] = cam.eyeY;
    pos[2] = cam.eyeZ;
  }


/*
 propagate the tripod position to the real camera 
*/
  refreshCameraPosition() {
    let cam = this.config.camera;
    let pos = this.config.position;
    let lookAt = this.config.lookAt;
    cam.setPosition(pos[0],pos[1],pos[2]);
    cam.lookAt(lookAt[0],lookAt[1],lookAt[2]);
  }

  // think to update real camera when a journey change the values
  setData(somePath, newValue) {
    setDataConfig(this.config, somePath, newValue);
    this.refreshCameraPosition();
  }
  // getData : leave standard
}
