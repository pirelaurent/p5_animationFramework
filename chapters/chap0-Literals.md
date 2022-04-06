# Organizing properties  

  **Class** definition in js organize a structure to hold the private properties of the objects of the class.  
  These properties can be accessed either by : 
 ``` javascript 
 myObject.thePropertyName;
 myObject["thePropertyName"]; 
 ```
## Structuring properties 
If a property is complex, holding several subproperties, a good way is to declare it as a **Literal Object**   
 A literal object is a data structure using key-value pairs and braces in any combination.
 ``` javascript
    fill: { active: true, color: [100, 255, 100, 100] }
  ```   
### using literal object in constructors 
All properties to be used in a class can be pre-defined in a Literal Object.   
This allow to create in one shot all properties with initial values.    
In this framework, the properties of a class are defined in a **static** Literal object :   
```javascript  
  static defaultProperties = {
    name: "my Object ", 
    visible: true, 
    stroke: { active: true, color: "white", weight: 1 },
    fill: { active: true, color: [200, 100, 100, 200] },
  };
``` 
In the constructor, a copy (*copyProperties*) is made in order to have independant variables for each  instance. 
These properties are then added to the class (*extendProperties*)
```javascript 
    extendProperties(this,copyProperties(MyClass.defaultProperties));
```  
Any object created with ```new MyClass()``` will have these properties with their values.    
To give other values for a specific instance, just have to give the changes:   
```new MyClass({stroke: { color: "blue"}})```   
This new literal will be merged in a controled way in the constructor by :   
```javascript 
if (instanceProperties != null) patchProperties(this,instanceProperties);
```   
## library utilProperties  
This library has the following functions :   
### **copyProperties**
```javascript 
// to get a deep copy, the simplest way is to serialize then deserialize the structure
function copyProperties(source) {
  var newConfig = JSON.parse(JSON.stringify(source));
  return newConfig;
}
```
 ##### literal JSON compatible for config in class definitions
 Despite a literal can hold any kind of value, including specific objects, stay in JSON compatible literals (ie with native js types) for the default values of a class in order to be copied easily.  
 When patching for an instance specificities, you can use any kind of data.  

### **patchProperties**
Patch of a literal with another literal in a controled way:    
You can change any values of the initial literal, but **cannot add new keys**.   
This mechanism allows to be sure to respect the static definition of the class in the instances.   
In particular, this avoids typo errors in the instanceProperties literal.  

### **extendProperties**
Same as previous, but this time new property keys are allowed.  
This is used to extend the current object with the new properties coming from the static definition.  

#### controls done by *patchProperties* (and absent in *extendProperties* )  
In case of an unknown key, an error is raised and the patch stopped.   
If the key exists but the new value is not of the same kind of the existing (simple value , collection {...}, array [...], function, etc.)patch will inform at the *verbose* level of the console that the type has changed, as a reminder before problems arise.    
Below, a debug message : color was an array and is now a string,  
then an error as the key 'pouet' is not in the class config:   
<img src = "../img/forDoc/control0.png" height = 80></img><img src = "../img/forDoc/verboseChrome.png" height = 120></img> 
    
# a class hierarchy to animate things 

 ## *BasicObject*
 **BasicObject** do quite nothing:  
It initialises a hierarchy with a single property *name*   
It defines two methods to access properties by their name as string  :  
```getData(someDotPath)```   
```setData(someDotPath, newValue)```    
This will allow to give a string path to a scenario in charge of developing over time some data of an object:  
``` 
 parameter: {
  name : "fill.color",
  ...
```   
Then internaly, at the due date, the scenario will call   
```myObject.setData( parameter.name, newValue)```



 #### BasicObject code 
``` javascript 
cclass BasicObject{
  // the config will create new properties into the class 
  static defaultProperties ={
    name: "BasicObject no name"
  }
  constructor(instanceProperties) {
    extendProperties(this,copyProperties(BasicObject.defaultProperties));
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }
```   


### Mechanism of inheritance of literal properties
A sample with a extension of BasicObject :  
```javascript  
class MoveableObject extends BasicObject{
  // Default config of this level
  static defaultProperties = {
    name: "moveableObject no name", // to facilitate debug, give a name to your objects
    position: [0, 0, 0], // current location of object to draw it
    angleMode: null,  // what's the unit of angle . If not set use current angleMode 
    rotation: [0, 0, 0], // current rotation of object. order is: rotateX, then Y , then Z
    scale: [1, 1, 1], // optional scale in the 3 directions
  };

  constructor(instanceProperties) {
    super();
    extendProperties(this,copyProperties(MoveableObject.defaultProperties));
    if (instanceProperties != null) patchProperties(this,instanceProperties);
  }
    ...
```

 
#### constructor 
A call to *super()* will initialize the object properties as defined by the ancester.  
This is *extended* with a copy of the static literal of **this level**.    
Finally, the configuration is *patched* by the specific given for the new instance.   
*(Be aware of super() without parameters because at ancester level, properties of instance are not known and will result in errors )* 

####  reserving property name in class definition 
As explained, the static literal defining a class properties will be cloned to create instance properties.  
The copy through JSON doesn't allow non serialisable objects, but a literal given in *patchProperties* can have such objects.   
To avoid a key error while patching, the good way is to have a *reserved key with null* in the static properties and to change it with the  instance properties literal. 
```javascript 
  static defaultProperties = {
    model: null, // the shape to draw 
    texture: { active:false, image: null } // optional texture
  };
```  
You can see examples in the next chapter.   

#### more  
see source code in *util/utilProperties.js*