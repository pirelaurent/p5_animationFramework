# Basic animations 
In this chapter, we will use scenarios to move some *graphicObject* .    
## a general script for journeys 
The generator *scriptJourneyBase* allows classical uses like moving an element from place to place.  
This script uses a literal description of the *journey*,   
This script uses a literal description for each parameter involved in the journey.  

## description of a journey 
Each parameter can "travel" from one value to another in a certain amount of time.    
This can be a position, a rotation, a color, everything you want to see changing along time.   
Below a basic journey whith several parameters as travellers :   

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
      end: [150, 230, 0], // the destination value of parameter (start is its current value)
    },
    {
      name: "fill.color", // the parameter involved in the journey
      start: [50, 50, 50], // the start value of parameter. Optional.
      end: [100, 200, 255], // the destination value of parameter
    },
  ],
};
  ```
This 'journey' can be used with any kind of objects, as long as they have the named parameters in their *config* structure.  
It will make a move, a rotation and a variation of color in 10 s.   

Below, we use a dragon model (of class *GraphicObjectModel*) with initial variants to set for this instance against the defaults:    
```javascript 
dragon = new GraphicObjectModel({
    name: "dragon",
    model: dragonObj, // previously loaded in preload 
    fill: { active: true, color: [100, 255, 100, 100] },
    stroke: { color: "black" },
    scale: [3, 3, 3],
    position:[0,100,0],
    rotation: [150, 90, 0],
  });
  ```
<img src = '../img/forDoc/dragonStart.png' width = 200></img>


## standard mode: linear interpolation from start to end 
Without more information, the transport will be **linear interpolations** from start to end in the defined duration : 
- linear interpolation of values : **value = (end - start)/duration \* estimated elapsed time**. 
- linear interpolation of the time : **estimated elapsed time = effective elapsed time** 
- New values are calculated at each interval defined for the scenario, with care of the elapsed time since last call. 
  
We will see later some functions to change estimated elapsed time  for more elegant movements.   
We will also see later interpolation using beziers curves for better trajectories than linear.   

## a scenario to pilot the journey  
To apply the *journey* to the *dragon*, we define a scenario with the generic script *scriptJourneyBase* which take as parameters the configuration of the journey and the object to move :  
```javascript 
 scenario_0 = new Scenario(
   {scenarioName: 'movement0 sample', interval: 100, trace: true},
   {scriptName: " dragon move", generator: scriptJourneyBase, arguments: [journey, dragon] }
  ) 
  ```
### Some details on the  generic script for journeys 
The following is simplified to see only main blocks : 
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
In the example, *duration_ms* is 10000 and default yield from scenario is *interval: 100* : the travel will be splitted in 100 little steps.Depending on your computing power, you can adjust the *duration_ms* and the *yield value* to have smoother trips if necessary.      
The methods *anObject.getData(name)* and *anObject.setData(name,value)* are explained in *literals.md* chapter.     
=> As long as an object has an internal *config* data with the defined name, a journey can modify it along the travel.        
We will see later how to wrap a camera to take advantage of journeys.    

### at the end of this journey : dragon has moved and its aspect has changed 
<img src = '../img/forDoc/dragonEnd.png' width = 200></img>   
In ten seconds, the dragon have move ( left, up and deeper ), rotate (turned head on its right) and varied of color  (from some grey to some blue ), all this in a continuous coordinated manner.   

#### warning on some parameters
For instance, changing a value from  *start* to *end* suppose that the values are numbers.   
These numbers can be simple value like  *radius:20* , or an array like *position: [10,20,30]*   
A common error can come for color's values: you cannot go from '*green*' to '*blue*', but you can go from *color:[0,255,0]* to *color:[0,0,255]*    
For any array of any size, interpolations are applied for all elements of the array.   
For colors as example, you can go from  start: [100,255,255,50] to end: [255,100,255,250] including rgb and alpha.   
 

Next chapter : **advanced animations** 