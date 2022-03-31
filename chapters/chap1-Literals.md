# Literal objects
 A literal object is a data structure using key-value pairs and curly braces in any combination.     
 This avoid to create discrete variables and simplify generic behaviours.    
 #### reserved word : config 
 In the framework the holder of object's data is named **config**, short of *configuration*   
 #### JSON compatible for default config 
 Despite a literal can hold any kind of value, including specific objects, here we stay in JSON compatible literals (ie with native js types) for the default values.  
 Later, to replace the value of a key, we can use any object of the context.  
### a static config declaration sample 
```javascript 
  static config = {
    name: "moveableObject no name", // to facilitate debug, give a name to your objects
    position: [0, 0, 0], // current location of object to draw it
    angleMode: null,  // what's the unit of angle . If not set use current angleMode 
    rotation: [0, 0, 0], // current rotation of object. order is: rotateX, then Y , then Z
    scale: [1, 1, 1], // optional scale in the 3 directions
  };
  ```

## copy a literal and create a new one
```javascript 
// to get a deep copy, the simplest way is to serialize then deserialize the structure
function copyConfig(source) {
  var newConfig = JSON.parse(JSON.stringify(source));
  return newConfig;
}
```
#### from static config to instance config
The framework uses *copyConfig* to share a unique structure in a static of class definition, structure which is copied into each new object to insure their independancy. Then this personal copy will be patched with parameters given in constructor.   

## patchConfig: patch a literal with another literal subset
This function *patch* an existing literal with another that holds **any parts or subparts** of the destination. 

*patchConfig* is what happen in an object constructor :    
- defaultConfig is copied 
- the patch given in constructor is applied:   
```javascript 
  constructor(instanceConfigVariant) {
    this.config = copyConfig(MoveableObject.config);
    // apply variant if constructor was called with some parameters.
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }
```
This allows to only give the differences to update the default config.   
``` obj_3 = new GraphicObject( {position: [0,-200,0]});```  
#### controls on patch    
<img src = "../img/forDoc/control0.png" height = 80></img>
*patchConfig* checks that **the key already exist** inside the destination . If not it throws a console error like above. This avoid common typo errors.    
Other controls are sent to console at the *verbose* level for information. Check it if you want to see them.    
<img src = "../img/forDoc/verbose.png" height = 120></img>   
The value of a key can be a simple value , a collection {...}, an array [...], a function, etc.   
Replacement of a key value by another category can be intentional or not.  
The *patchConfig* function throws **verbose level messages** to the console to remind the decision.   



## extendConfig: extend a literal with another literal 
In some case, it is planned to add new properties not yet included in the previous structure.   
*extendsConfig* works like *patchConfig* (can change values of named keys) but allow creation of new key-value pairs without error. 
### Default config(s) propagation through inheritance         
*extendConfig* is used to complete at each level of inheritance the default config of ancesters with the data of the new level.  
Sample in *GraphicObjectModel* (that inherit from *GraphicModel* that inherit from *BasicObject*): super( ) will have collected the config of ancesters and this config is extended with default of this level:      
```javascript 
  constructor(instanceConfigVariant) {
    super();  // will have created part of the config under ancester's responsibilities
    // extend with a copy of default config of this level 
    this.extendConfig(copyConfig(GraphicObjectModel.config));
    // apply variant of new object if called with
    if (instanceConfigVariant != null) this.patchConfig(instanceConfigVariant);
  }
  ``` 
## accessing config data of an object
In code, any data of literal can be get or set with either a dot notation or an array notation : 
``` javascript 
 obj_1.config.fill.color = 'yellow'
 obj_1.config["fill"]["color"]= 'orange' 
 obj_2.config.stroke.active = false; 
 obj_2.config["stroke"]["active"] = true;
 console.log(obj_2.config);
```
### interpreted values 
The framework introduces another way using a textual dot notation: 
- getData (path)
- setData (path, value)

As part of the basic class of framework, data are extracted from *object.config* 

``` javascript    
obj_1.setData("fill.color","yellow");
obj_1.setData("position[0]",120);
obj_2.setData("position",[120,0,200]);
if (obj_2.getData("stroke.active")== false) 
...etc. 
```
This kind of notation will be used in the framework to act on the values during a **scenario** described with a textural configuration (to stay on the key *"fill.color"* and not on the value *fill.color*)  

#### learn more 
see source code in *util/utilConfig.js*