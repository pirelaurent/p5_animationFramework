# Developing graphic objects 
Some class to develop more quickly in p5 
## class GraphicObject
A simple class with all properties to be drawn as a default configuration literal : 
```javascript 
class GraphicObject {
  static config = {
    name: "no name", // to facilitate debug, give a name to your objects
    visible: true, // if false, object is not drawn
    // -- 
    position: [0, 0, 0], // current location of object to draw it
    rotation: [0, 0, 0], // ( degrees )current rotation of object. order is rotateX, then Y , then Z
    scale: [1, 1, 1], // optional scale in the 3 directions
    // --
    stroke: { active: true, color: "white", weight: 1 }, 
    fill: { active: true, color: [200,100,100,200]}
  };  
``` 
and with a default method *drawModel* to be overriden later as needed : 
``` javascript   
  drawModel() {
    box(100, 150, 50);
  }   
```
### simplest samples 
<img src = "./img/forDoc/threeObjects.png"  width = 200></img>    

```javascript 
function setup() {
    can = createCanvas(800, 800, WEBGL)
    obj_1 = new GraphicObject();
    // constructor with patch to apply to default config
    obj_2 = new GraphicObject({
        position: [-200, 0, 0], // current location of object to draw it
        rotation: [30, 45, 0], // in degrees
        fill: { color: 'blue' }
    })
    obj_3 = new GraphicObject( {position: [0,-200,0]});
    // apply some change by code ( or make a subclass )
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
## Using keyboard and js console as an helper 
One can use keyboard in its sketch to act on the current program. 
