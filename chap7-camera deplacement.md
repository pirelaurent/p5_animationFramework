# camera movements 
Another use of journeys and literals is moving the camera.    
As camera is already a component of p5, we define a class **Tripod** to hold cameras. 
## Tripod class 
A tripod is a component localized in space like any other *MoveableObject* with some specific methods  and a *setData* overwritten : 

```javascript 

class Tripod extends MoveAbleObject {
  // specific for this level
  static config = {
    position: [0,0,700],   // replace the default [0,0,0] to see something 
    lookAt: [0, 0, 0],     // new property 
  };
 // ------ some specific methods  
  /*  mounting a camera on a tripod will give the camera the tripod position  */
  mountCamera(someCamera) { ... } 
  /*  mounting a tripod under a camera will give the tripod the current camera values */
  mountUnderCamera(someCamera) {... } 
/*
  refreshCameraPosition: propagate the tripod position to the real camera . 
  If code change tripod position values, this new coordinates must be propagated to the p5 camera 
*/
  refreshCameraPosition() {... } 
  /*
    setData is overwritten to propagate changes automatically 
  */
  setData(somePath, newValue) {
    setDataConfig(this.config, somePath, newValue);
    this.refreshCameraPosition();
  }
}
```

### sample 
The sketch **cameraLiberty** uses tripods:  
A belt of 6 tripods is set up around  Liberty :      
```javascript 
function createTripods(){
 var angle = 0; 
 var distance = 300;
 while (angle <360){
  var x = 2*distance * sin(angle) ; 
  var z = 2*distance * cos (angle);
  var y = 0; 
  var tripod = new Tripod(
    { name:'at '+angle,
      position:[x,y,z],
      lookAt:[0,0,0]
  })
  beltOfTripods.push(tripod);
 angle+=60;
 }
}
```
A scenario and a generator animate the story by jumping from a tripod to another.   
<img src = "./img/forDoc/lib0.png" width = 100></img><img src = "./img/forDoc/lib1.png" width = 100></img><img src = "./img/forDoc/lib2.png" width = 100></img><img src = "./img/forDoc/lib3.png" width = 100></img> <img src = "./img/forDoc/lib4.png" width = 100></img>  <img src = "./img/forDoc/lib5.png" width = 100></img>   
At each tour, the tripod climbs a bit to change its point of view.   
**The generator** :   
```javascript 
function * jumpTripod(aCam, maxTurns){
  let index = 0;
  let turns = 0 ; 
  while (turns<maxTurns){
    console.log("Camera on tripod "+index)
    beltOfTripods[index].mountCamera(aCam);
    yield 3000
    beltOfTripods[index].movePosition([0,-200,0])
    index+=1;
    if( index==beltOfTripods.length) {
      index = 0;
      turns+=1;
    }
  }// while 
}
```   
As one can see, this generator has to parameters, which camera and number of turns.   
**The scenario** to run this script must give these parameters as *arguments* :   

```javascript  
scenarioTurnAround = new Scenario(
  { scenarioName: "turn around Liberty", trace: true},
  [
    { scriptName: "jump on tripods", generator: jumpTripod, arguments:[camera1, 5 ]},
  ])
}
```  
Just have to start it : ```  scenarioTurnAround.start(); ```  
### so what ? 
for now, using Tripod is not a big step up from the native camera capabilities in p5.    
As a first tip, a tripod, as a moveableObject, can be moved with the keyboard helper functionalities to find a good point of view for the camera it holds.   
how to :   Add the keyboard helper in your draw loop.   
```
function draw() {
  orbitControl(1, 1, 1);
  kbHelp();
```
give a place to your tripod(s) in the list of moveable elements by keyboard : 
( put this in your setup ) 
``` kb.objectsToMove.push(initialTripod); // slot 0 ``` 
Key 0 will select this tripod.   
Another way is to use console *repl* and type into console prompt: ```kb.toMove = initialTripod```
   
Using the keys x,y,z, <, > , you can move the tripod to find a good place and strike key "enter" to get values :    
<img src = "./img/forDoc/libTripodGoosPlace.png" width = 250 ></img> 
<img src = "./img/forDoc/libCameraLog.png" width = 250 ></img> 

But the better for having a tripod holding a camera is to use the journey framework to move the camera along any travel, from linear to beziers curves. 


