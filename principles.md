# Literal objects and JSON structure 
## Literal as parameters 
To create objects with many options, rather than a long constructor with parameters, use a literal like : 
```javascript 
config = {
    name: "myObject",    // to facilitate debug, give a name to objects
    visible: true,      // if false object is not drawn
    position: [0, 0, 0],// current location of object
    stroke: { active: true, color: "white", weight: 1 },
    fill: { active: false, color: [200,100,100] },
  };

  let myObject = new SomeObject(config);
  ```
  ### Differences between literal and JSON 
  The previous example is a literal (we define it in code ) which is JSON compatible. That means it can be serialized/deserialized through a JSON message.   
  This is useful to make a deep copy of the previous literal :  
```javascript
function copyConfig(originalConfig) {
  // the simplest way is to serialize then deserialize the structure
  var newConfig = JSON.parse(JSON.stringify(originalConfig));
  return newConfig;
}
```
 ### Non JSON compatible literal 
 As soon as we use special objects in our literal, it cannot be serialized.   
 in a P5.js code, if we replace the previous position by a Vector:    
``` position: createVector(0,0,0)```  
Despite this is allowed for a literal, it cannot be copied as *P5.Vector* is not JSON compatible.   
### warning with specific code
Another drawback is the use of some P5 code <u>before</u> the full P5 lib was loaded.   
Ex: we may think to use the color function in the config:    
 ```fill: { active: false, color: color(200,100,100) }```   
 Everything is ok, included deep copy through json ( as Color object is serialisable), but need that P5 was already loaded. This avoids to define static config in source code of external Classes without some scrit order of loading.   
 ( One way to deal with is to furnish a static config at run time only, in main code.   )
### the more general => Use literal JSON compatible
To define parameters (which become internal variables), structure must be JSON compatible.   
# Accessing data 
The config used in a constructor is first copied to avoid instances conflicts.   
One can keep it internally as is, avoiding to create a lot of discrete individual variables. 
## reading data 
### Dot notation vs list of key string
There is two ways to access data. Samples : 
``` javascript 
console.log(config.stroke.weight)
console.log(config["stroke"]["weight"])
// data within arrays :
console.log(config.fill.color[2])
console.log(config["fill"]["color"]["2"])
```
Both are quite equivalents in performance . For one hundred thousands (100 000 000) calls we got : 
```
1805.199999999255 ms with config.fill.color[2]; result is :100
1800.3999999985099 ms with config["fill"]["color"]["2"]; result is :100
```
Caution : be aware to ask the good question on the right variable if heterogenous:    
```config.stroke.color[2];```  will result in 'i' as stroke.color is 'white' and i is at indice 2...
## updating data 
Both notation can be used to change a value, simple or complex, but for only one node, even if the tail is complex  : 
``` javascript 
// replace a leaf 
config.stroke.weight = 2;
config["stroke"]["weight"] = 2 
// replace a branch
config.stroke = { active: false, color: [200,0,0,100],weight: 3} 
config["stroke"] = { active: false, color: [200,0,0,100],weight: 3} 
```
## extending data 
It is allowed to add new entries anywhere in the literal tree. 
```javascript 
config.fill.alpha = 50 // create alpha entry . set to 50
```   
Now fill is :
```javascript
fill: {active: false, color: Array(3), alpha: 50}
```
### Drawback 
You have no warning if you add a non existing key in the literal.   
Misspelling can leave hidden deep bug in your code.   
Let's say you want to hide an object : 
```config.Visible =false ``` .  
In fact you have created another entry and now config has ```visible``` and ```Visible``` keys.
### Framework controls key names in object constructor
- a <u>static reference</u> structure is designed in the class. The parameters' entries are checked against these keys to  avoid typo errors.   
- In the constructor, the values are compared and set with a kind of :   
  ``` patchConfig(MyClass.defaultConfig, myInstanceConfig)```
### Avoiding drawback updating a data 
Simplest way: Be aware writing code. Ex: impose a camelCase notation! :-)   
Remember that a dot path returns the current value, not the pointer.  
So, don't think about creating a function like : 
``` javascript 
// main misunderstanding : 
function set(path,value){
  if(!path)console.error('wrong assignment'); else path = value 
} 
// try 
set(config.stroke.weight,2) 
```
Why : When you call ```set(config.stroke.weight,2)```  in fact you call ```set(1,2)``` !!!

### The framework way
We have seen in constructor that literal parameters are checked against the default static config of the Class , using the function *patchConfig*. 
#### patchConfig
This function can be used for any config, as well for a simple value :    
``` javascript
patchConfig(config, {stroke:{weight:2}})
```  
or for updating several values in one shot : 
``` javascript
// change display patching myInstance.config
patchConfig( config,
  {
    stroke:{active:false}, 
    fill:{active:true, color:'red'}
  })
``` 
As the parameters list is also a literal, it can have been prepared in a const : 
``` javascript
const changeDisplay =     {
    stroke:{active:false}, 
    fill:{active:true, color:'red'}
  }
patchConfig(config, changeDisplay);
```
Note : later in the class a relay will be set to apply directly patchConfig to the internal this.config, resulting in a call on an object like: 
``` javascript
myInstance.patchConfig(changeDisplay);
```

### How to get values ? 
You cannot define a literal without value like : *```stroke:{active} ```* 
But the *patchConfig* function works between two literals named previously *config* and *modifier*.   
So we can conversely patch the modifier with the value of the config resulting in an extract.   
This reverse is named extractConfig:        
### extractConfig (config, extractor)

```javascript
// can use any value to complete the literal, value will be replaced by current config data
// get from config
var response = extractConfig(config,{stroke:null})
//response:{"stroke":{"active":true,"color":"white","weight":1}}
// write to config
patchConfig(config,{stroke: {color:'blue'}});
// can (re) use a non empty modifier
// get last value 
var response = extractConfig(config,response)
//response:{"stroke":{"color":"blue"}}
```

### More functions when direct code is not enough
As seen previously, one can use direct code to get or set a unique value
``` javascript
var coul = myInstance.config.stroke.color; 
myInstance.config.stroke.color = 'red'; 
```
But there is some case where you cannot use direct code.   
Suppose you want to apply at run time to several objects something like 
``` javascript
config.stroke.active = false; 
config.fill.active = true; 
```
You cannot catalog somewhere a general action like *config.stroke.active = false;* and change the config root at runtime.Too late: config has been evaluated when code was loaded. 
#### using function patchConfig
```javascript
action = 
{ 
  afterS: 10, // 10 seconds
  apply: { stroke:{active:false}, fill:{active:true}}
}
```
You can apply the changes to any config
```patchConfig(myInstance.config, action.apply);``` 
but dot notation is rather efficient to describe an action. 

This is one of the reasons which led to create the simplified functions : 
## setData(dotPath,value)  & getData(dotPath)
"dotPath" stands for a string that contains path string in dot notation. Examples: 
``` javascript 
// with instance function relay using 'this.config' internally
myInstance.getData("stroke.weight");
myInstance.setData("fill.active", true); // with key control 
```
or more generally : 
``` javascript 
// full parameters 
function getData(anyConfig, dotPath)
function setData(anyConfig,dotPath,value)
``` 
These functions have a built in control to avoid wrong key names. These controls are done against the current config.   
 One can replace any part with a known key with any kind of tail, but cannot create a non existing key in first place.  
### So how to previously extend a config  ? 
There is another general function :  
```extendConfig(anyConfig, someParametersAndMore)```   
which does the same as *patchConfig*, but doesn't check for unknown keys, allowing to create new ones without errors.
#### Internal use of extendConfig 
This function is used internally in the subClass hierarchy to add new default parameters to each level. 
### A bit more info about controls
Set apart the errors of unknown keys, the functions give more information (<u> set console debug level </u>) about risks :
you will be informed by a debug message when a key change of category of size. 
As an example, you can see often these debug info in P5 while changing color :    
``` javascript
// (stroke color is white at setup) 
patchConfig(config,{stroke:{color:[200,100,100]}}) //rvb  
// debug message : color:   "white" replaced by [200,100,100]
patchConfig(config,{stroke:{color:[200,100,100,50]}}) //rvba 
// debug message : color:   [200,100,100] not the same length as [200,100,100,50]
patchConfig(config,({stroke:{color:"red"}}))  // native color name 
// debug message : color:[200,100,100,50] replaced by "red"
```  
Previous samples are without effects, but the following can result in a hidden bug if you don't look at debug console: 
```javascript
patchConfig(config,({position: [20,12]})) // now array of two: no more z axis !
// think about to turn on debug message to see indication:
// position:   [0,0,0] not the same length of [20,12] 
```

# Next 
See and understand the P5 framework using these principles and begin to create graphics object hierarchy. 
