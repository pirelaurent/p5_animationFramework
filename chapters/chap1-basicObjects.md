# Developing graphic objects 

Some classes to develop more quickly in p5. 
(In *graphicObject.js* source code )

## class MoveableObject 

A simple class to hold properties with a **literal object** as default properties: 
``` javascript 
class MoveableObject extends BasicObject{
  constructor(instanceProperties) {
    super();
    extendProperties(this,
    {
      name: "moveableObject no name", // to facilitate debug, give a name to your objects
      position: [0, 0, 0], // current location of object to draw it
      angleMode: null,  // unit in P5(DEGREES or RADIANS) if object don't use current one 
      rotation: [0, 0, 0], // current rotation of object. order is: rotateX, then Y , then Z
      scale: [1, 1, 1], // optional scale in the 3 directions
    });
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }
  ```   
   **angleMode** : in some case (reuse of components) the expected *angleMode* for object to draw itself is not the current one. One can change it on the fly only for this object by setting value here. It will be restored to default after usage.
  In the examples, i use to set *angleMode(DEGREES)* in the setup* (and don't use *angleMode* in properties) 

## class GraphicObject

An inherited class with new properties and methods to be able to draw itself.  
The default properties to be added at this level are given as a literal object:    
```javascript 
class GraphicObject extends MoveableObject {
  constructor(instanceProperties) {
    super();
    extendProperties(this,{
      name: "graphicObject no name ", 
      // screen drawing
      visible: true, // if false, object is not drawn
      stroke: { active: true, color: "white", weight: 1 },
      fill: { active: true, color: [200, 100, 100, 200] },
    });
    // apply variant if called with
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }
``` 
The class has a default method *drawModel* for debug to see something:
``` javascript   
  drawModel() {
    box(100, 150, 50);
  }   
```
This method can be overwritten as required

### simplest sample 
  
<img src = "../img/forDoc/threeObjects.png"  width = 160 />   

See *sketches/ 1-basicObject/sketch.js* :   

```javascript 
function setup() {
    can = createCanvas(800, 800, WEBGL)
    // an object with all default properties
    obj_1 = new GraphicObject();
    // constructor with some patch to apply :
    obj_2 = new GraphicObject({
        position: [-200, 0, 0], // current location of object to draw it
        rotation: [30, 45, 0], // in degrees
        fill: { color: 'blue' }
    })
    // another 
    obj_3 = new GraphicObject( {position: [0,-200,0]});
    // apply some overloading of method by code ( or make a subclass )
    obj_3.drawModel = () => sphere(50)
}

function draw() {
    orbitControl(1, 1, 1);
    background(40);
    obj_1.draw();
    obj_2.draw();
    obj_3.draw();
}
``` 
## class GraphicModelObject 

This inherited class has new properties to draw itself with a model and a texture.  
A default configuration is also given as a  literal object:  
```javascript
class GraphicObjectModel extends GraphicObject {
  constructor(instanceProperties) {
    // create properties of ancesters 
    super(); 
    // new properties 
    extendProperties(this,{
      model: null, // the shape to draw
      texture: { active:false, image: null } // optional texture
    });
    // apply variant if any for the instance
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }
  // overWritten methods
  drawModel() {
    if (this.texture.active) texture(this.texture.image);
    model(this.model);
  }
}
```
In these default properties, *model* and *image* are just placeholders to be filled later at object instantiation.   

##### p5 good practice  

With p5, some problems can occur if *loadModel* or *loadImage* are called outside of *preload*.   
  - code all *loadModel* and *loadImage* in **preload** 
  - construct *GraphicsObject* in **setup** with variables set previously in *preload*. 
  
### sample: Two cups of coke 

```javascript 
let cola_cup, textureWater;
function preload() {
  cola_cup = loadModel("../../models/cola_cup.obj");//free obj (turbosquid.com author:rozenkrantz)
  textureWater = loadImage("../../textures/water.jpg")
}

function setup() {
  can = createCanvas(800, 800, WEBGL);
  let aCup = new GraphicObjectModel(
  {
    name: "my favorite cup",
    model: cola_cup,
    texture: { active: true, image: textureWater },
    stroke: { color: "darkred"}
  });
  myCups.push(aCup);
  aCup = new GraphicObjectModel(
  {
    name: "my beautiful cup",
    model: cola_cup,
    texture: { active: true, image: textureWater},
    stroke: { active: false},
    position: [100,100,0]
  });
  myCups.push(aCup);
} // setup

function draw() {
  background(20);
  orbitControl(1,1,5);
  for (let aCup of myCups) aCup.draw();
}
```
<img src = "../img/forDoc/twoCups.png" width = "300" />   

*see sketches/ 2-cupOfCoke/sketch.js*  
Notice that the obj model (which results in an internal *p5.Geometry*) will be shared by all instances.   
The same for texture image.  

#### for debug 

Some messages are thrown at the **debug level** on console to follow what happens for the two object's construction through the hierarchical extensions and replacement of properties :    
<img src = "../img/forDoc/verboseSample.png" width = "450"/>   

