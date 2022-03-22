Some tips to facilitate code organization using literal objects as configuration .
# Literals as configuration structures : 
## principles
 - all useful parameters to construct a class instance are declared in a config structure 
 - a Static default config is associated to the class in order to : 
   - allow to create an object just by new(SomeClass)
   - allow to give only specific changes relatively to default config
   - control that changes match existing keys to avoid typo errors
## sample 
### simple class to draw a mobile object :
 ( @see tests/testConfig/sketch.js )   
 All useful parameters are described with default values in a static config: 
```javascript 
class SimpleObject {
  // to keep track of a default config, use a static of class
  static config = {
    name: "no name", // to facilitate debug, give a name to your objects
    visible: true, // if false object is not drawn
    position: [0, 0, 0], // current location of object
    rotation: [0, 0, 0], // ( degrees )current rotation of object. order is rotateX,then Y , then Z
    scale: [1, 1, 1], // optional scale in the 3 directions
    // design
    stroke: { active: true, color: "white", weight: 1 },
    fill: { active: false, color: "grey" },
  };
  ```
When an instance is created, the static config is used but must not be shared, so it is first copied.  
If some changes are given for instance constructor, they are applied.  
This allows to construct with : 
- no config at all : use static config
- partial config : patch static config
- full equivalent config to full replace default

```javascript
 constructor(optionalConfigChange) {
    // start with default and ensure independancy of local config by copying
    // to reach the static of current class, use this.constructor
    this.config = copyConfig(this.constructor.config);
    // is there a variant , full or partial, to apply .
    if (optionalConfigChange != null)
      this.config = patchConfig(this.config, optionalConfigChange);
  }
  ```
Note that we use ```copyConfig(this.constructor.config);``` to access static data in order to have code that can run with any subClass with there own static.   
(If no inheritance in mind we may have use  ```copyConfig(SimpleSphere.config)``` instead.)   
### Samples of instance creation 
```javascript   
  // use default config
  myBox1 = new SimpleObject();
  ```
```javascript
  // use default config and apply some change with inline config  in constructor
  myBox2 = new SimpleObject({
    fill: { active: true },
    position: [150, 150, 100],
    rotation: [45, 0, 0],
  });
  ```
You can also prepare some flavours in discrete config then use it 
``` javascript 
// use predefined variant config to create object
  var typeBoxYellow = {
    position: [250, 250, 100],
    stroke: { active: true, color: "yellow" },
    fill: { active: true, color: "#A0A000B0" },
  };
  // and use it later for new object of this kind
  myBox3 = new SimpleObject(typeBoxYellow);
  ```
## key replacement control in patchConfig   
The function ```patchConfig(config, modifier)``` check that a key exists previously to its replacement.   
If the key does'nt exist a console error is emitted and the new key is not added.  This prevents from misspelling key names.   
### replacement reminder 
A key value can be of two main categories : simple value or  collection.    
Replacement of a key value by another category  can be intentional or not.  
The *patchConfig* function throws warning to the console to remind the decision.  

A serie of unit tests are in *updateTest.js* to check various scenarios. 
Here is the console output with some errors and warning samples : 
 <img src="imgDoc/consoleTest00.png" alt="console output" width=600> </img>   

### weak controls in extendConfig 
Some time it is useful to add new key : the *extendConfig* function do the same job as *patchConfig* but allows to have new keys. See test3 for an example.  
This capacity is used below in inheritance to extends the default config from parent to child. 

## subclass and config 
To have same behaviour in a subclass, we need to : 
- have a static default config , reusing parent with some extension 
- leave super constructor do the job : take static config of class, apply instance options.
  
### sample 
```javascript 
class SimpleSphere extends SimpleObject {
    // can have more config to add or change against super class
    static complementConfig = {
      // a new property
      radius: 100,
      // some change to default
      stroke: { weight:0.2 }
    };
    // create a full static config for this class using ancestor and complement
   static config = extendConfig(
      copyConfig(super.config),
      this.constructor.complementConfig
    );
    // let do the job of super : copy static to local and apply instance optional config
    constructor(optionalConfig) {
      super(optionalConfig);
    }
    // overWrite for model 
    drawModel() {
      sphere(this.config.radius);
    }
  }
  ```
 A static config for SimpleSPhere is set up by copying then updating parent config, using *extendConfig* to jump over key control of existence. 
 Now the new class has the same behavior as parent and constructor is simple : 
  ```javascript
  // let do the job of super : copy static to local and apply instance optional config
  constructor(optionalConfig) {
    super(optionalConfig);
  }
  // overWritten
  drawModel() {
    sphere(this.config.radius);
  }
}
  ```
## using config in code 
as a structure, it's easy to use config with or without relay : 

``` javascript 
// direct change
myBox1.config.visible = false; // hide object 
myBox2.config.stroke.color = 'red'
// relayed change 
let pos = myBowl1.config.position;
pos[0]+=10; // move on x 
pos[1]+= 30; // move on y 
// 
  myBowl2.config.scale[0]/=1.1;
// etc..
```

### P5 and colors 
P5 has several ways to declare colors.   
In a config declared outside main p5 program, aka in static configs  or in some global variable, we can use : 
```javascript 
  var original = {
      color1: "black",  // string color name
      color2: "#FF00FF77", // string hexadecimal 
      color3: [200,200,0], // array RGB
      color4: [200,200,0,100], // array RGB Alpha
      color5: "white"
    };
```
In a config defined in running code, we can also use the function *color* like in : 
``` javascript 
var resu = extendConfig(original,{
      color5: color(100,50) // special: can be used in runnning code, not in inline , global or static
  })
  ```
this way is not usable in static as color function is not known until p5 is full initialized. 

#### normal warning 
If you change of color style in your config update, you will have some warning that are normals, consequences of controls on changing simple value to collections and reciprocally: 
 <img src="imgDoc/consoleTest01.png" alt="console output" width=600> </img>  
The last one is when using color function which result in a full color instance.

# To conclude 
Using literal objects gives powerfull tool to configure objects externally ( no need to create internal discrete variables).  
special function  *modifiyConfig* allows to define variants reduced to effective changes.  
special function *patchConfig* allows to extends config along a class hierarchy with full reuse of parents. 

### to be convinced 
Equivalent constructor for SimpleObject with default values could be 
```javascript
constructor( visible = true,stroke=true,strokeWeight= 1, fill = false, strokeColor="white", fillColor= "grey", positionX=0, positionY=0, positionZ=0, rotationX=0, rotationY=0, rotationZ=0){
  // and copy in local one to one...
    this.visible = visible; 
    this.stroke = stroke; 
    this.strokeWeight = strokeWeight; 
    //etc
```

