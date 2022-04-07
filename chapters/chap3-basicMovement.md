# Basic animations 
## scriptJourney
The generator *scriptJourney* can change **any property of any kind of object** in time, according to a trajectory from a *start value* to an *end value*.   
Applied to a position this can move an object in space.  
Applied to an alpha part of a color, this can make an object appear and disappear
etc. 
### scriptJourney parameters 
The scriptJourney waits for a **journey definition as a literal**  and a **owner of data** ( literal object or instance of a class )


##  journey definition  
Each parameter can "travel" from one value to another in a certain amount of time.    
This can be a position, a rotation, a color, everything you want to see changing along time.   
Below a basic journey whith several parameters to change in time  :   

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
      start: [100, 255, 100, 100], // the start value of parameter. Optional.
      end: [100, 200, 255, 255], // the destination value of parameter
    },
  ],
};
  ```
This 'journey' will make a move, a rotation and a variation of color and brightness in 10 s.   
It can be used with any kind of objects, as long as they have the named properties.   
#### about parameters in journey 
Changing a value from  *start* to *end* suppose that the values are numbers.   
These can be simple values like  *radius:20* , or arrays like *position: [10,20,30]*   
A common error can come for color's values: you can't go from '*green*' to '*blue*', but you can go from *[0,255,0]* to *[0,0,255]* (or from [100,255,255,50] to [255,100,255,250] including alpha).   
=> For any array of any size, interpolations are applied for all elements of the array. 

### default calculation : linear interpolation 
Without more information, the trajectory will be a **linear interpolations** from start to end in the defined duration : 
- linear interpolation of values : **value = (end - start)/duration \* estimated elapsed time**. 
- linear interpolation of the time : **estimated elapsed time = effective elapsed time** 
- New values are calculated at each interval defined for the scenario, with care of the elapsed time since last call. 
  
We will see later some functions to change estimated elapsed time  for more elegant movements.   
We will also see later interpolation using beziers curves for better trajectories than linear.   



### applying our journey to an object
Below, we use a dragon model (of class *GraphicObjectModel*) with initial properties:    
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
#### a scenario to pilot the journey  
To apply the *journey* to the *dragon*, we define a scenario with the generic script *scriptJourney* which takes as arguments: [**the definition of the journey** , **the object to move**] :  
```javascript 
 scenario_0 = new Scenario(
   {scenarioName: 'movement0 sample', interval_ms: 100, trace: true},
   {scriptName: " dragon move", generator: scriptJourneyBase, arguments: [journey, dragon] }
  ) 
  ```
And that goes from start to end on each parameter :   
<img src = '../img/forDoc/dragonStart.png' width = 200></img>
<img src = '../img/forDoc/dragonEnd.png' width = 200></img>   



## Technical details on the  generic script for journeys 
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
      // calculate current proportion of time ( between  0 and 1)
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
In the current example, *duration_ms* is 10000 and default yield from scenario is *interval_ms: 100* : the travel will be splitted in 10000/100 = 100 small steps.You can adjust the *duration_ms* and the *yield value* to have coarser or smoother trips if necessary.      

#### using generator scriptJourney 
As this generator is agnostic about values or objects, it will be helpfull for cameras, lights, sounds, etc.   

Next chapter : **advanced animations** 