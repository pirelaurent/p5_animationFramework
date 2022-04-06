/*
    tripod to hold a camera 
    In p5 a camera has a position to be (eye) and a position to look at(center)
*/

class Tripod4Camera extends MoveableObject {
  // specific for this level
  static defaultProperties = {
    name: "Tripod Camera no name",
    position: [0,0,700],   // replace the default [0,0,0] to see something 
    lookAt: [0, 0, 0],     // new property 
    camera: null, // will be replaced by an effective camera
  };
  
  constructor(instanceProperties) {
    super();
    extendProperties(this,copyProperties(Tripod4Camera.defaultProperties));
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }

  /*
   mounting a camera on a tripod will give the camera the tripod position 
  */
  mountCamera(someCamera) {
    this.camera = someCamera;
    this.refreshCameraPosition();
  }
  /*
   mountUnderCamera  : the tripod will take the current camera values 
  */
  mountUnderCamera(someCamera) {
    this.camera = someCamera;
    let cam = this.camera;
    let lookAt = this.lookAt;
    lookAt[0] = cam.centerX;
    lookAt[1] = cam.centerY;
    lookAt[2] = cam.centerZ;
    let pos = this.position;
    pos[0] = cam.eyeX;
    pos[1] = cam.eyeY;
    pos[2] = cam.eyeZ;
  }


/*
 propagate the tripod position to the real camera 
*/
  refreshCameraPosition() {
    let cam = this.camera;
    let pos = this.position;
    let lookAt = this.lookAt;
    cam.setPosition(pos[0],pos[1],pos[2]);
    cam.lookAt(lookAt[0],lookAt[1],lookAt[2]);
  }

  // think to update real camera when a journey change the values
  // overwritten
  setData(somePath, newValue) {
    setProperties(this, somePath, newValue);
    // for any value, we refresh whole camera 
    this.refreshCameraPosition();
  }
  // getData : leave standard

  logInfo(){
    super.logInfo();
    console.log(` lookAt: [${this.lookAt.toString()}]`);
  }

}
