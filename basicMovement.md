# Basic animations 
In this chapter, we will use scenarios to move any *graphicObject* .    
( see previous chapters: graphicObject.md, literals.md, scenario.md )  

## journey of parameters 
A parameter can "travel" from one value to another in a certain amount of time.    
This can be a position, a rotation, a color, everything you want see changing during time.   
Let's describe a basic journey whith several parameter travellers :   

``` javascript 
var journey = {
  duration_ms: 10000, // duration of the journey
  // array of parameters in this journey
  parameters: [
    {
      name: "position", // the parameter involved in the journey
      start: [0, 100, 0], // the start value of parameter. Optional.
      end: [-50, -200, -600], // the destination value of parameter
    },
    {
      name: "rotation", // the parameter involved in the journey
      end: [150, 230, 0], // the destination value of parameter
    },
    {
      name: "fill.color", // the parameter involved in the journey
      start: [50, 50, 50], // the start value of parameter. Optional.
      end: [100, 200, 255], // the destination value of parameter
    },
  ],
};
  ```
This 'journey' can be used with any kind of objects, as long as they have the named parameters in their configuration structure. 

For the example, we will use a dragon model of class *GraphicObjectModel* with initial variants on the default config:    
```javascript 
dragon = new GraphicObjectModel({
    name: "dragon",
    model: dragonObj, // from a free obj on turbosquid.com author rozenkrantz
    fill: { active: true, color: [100, 255, 100, 100] },
    stroke: { color: "black" },
    scale: [3, 3, 3],
    position:[0,100,0],
    rotation: [150, 90, 0],
  });
  ```
<img src = './img/forDoc/dragonStart.png' width = 200></img>


## standard mode of shift : linear interpolation  
Without more information, the transport will be **linear interpolations** from start to end in the defined duration : 
- linear interpolation of values :  value = (end - start)/duration * estimated elapsed time. 
- linear interpolation of the time : estimated elapsed time = effective elapsed time
We will see later that one can change estimated elapsed time with some functions to change speed during the travel for obtaining more elegant movements.   
We will also see later that some values interpolation can use beziers curves (especially for better trajectories)  
New values are calculated each time the journey is called  with care of the elapsed time since last call. 
## a scenario to pilot the journey  
To apply the *journey* to the *dragon*, we define a scenario with an associated script : 
```javascript 
 scenario_0 = new Scenario(
   {scenarioName: 'movement0 sample', interval: 100, trace: true},
   {scriptName: " dragon move", generator: scriptJourneyBase, arguments: [journey, dragon] }
  ) 
  ```
## a generic script for journeys 
The following script is a simplified one, just to see main blocks : 
```  javascript 
function* scriptJourneyBase(journey, anObject) {
  ...
  // follow time until duration elapsed 
  while (elapsedTime <= journey.duration_ms) {
    ...
    // loop on parameters
    for (var aParam of journey.parameters) {
      ...
      // calculate current proportion of time ( betwwen  0 and 1)
      var t = elapsedTime / aParam.duration_ms;  // t estimated elapsed = effective elapsed 
      ...
      // calculate new values for parameter : v 
      ...
      // ask the object to update its parameter 
      anObject.setData(aParam.name, v);
    }
    // end of parameters update loop
    yield   // return to caller for a pause using current interval of scenario
  } //end while on time 
```
Some remarks :  
In the example, duration_ms is 10000 and yield from scenario is 100 : the travel will be splitted in 100 little steps if nothing special happens, one step each 100 ms. If some hard work prevents from returning in time, the script will adapt the new position using the effective elapsed time.   
Depending on your computing power, you can adjust the *duration_ms* and the *yield value* to have smoother trips if necessary.   
The methods *anObject.getData(name)* and *anObject.setData(name,value)* are explained in *literals.md* chapter.  
=> As long as an object has an internal *config* data to hold the parameters'value, a journey can be used.   
We will see later how to wrap a camera to take advantage of journeys.  

### at the end of this journey : dragon has moved and its aspect has changed 
<img src = './img/forDoc/dragonEnd.png' width = 200></img>   
In ten seconds, the dragon have move ( left, up and deeper ), rotate (turned head on its right) and varied of color and  (from some grey to some blue ), all this in a continuous coordinated manner.   

Next chapter : **advanced animations**