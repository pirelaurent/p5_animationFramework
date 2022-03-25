# Advanced animation - 2
## Decoupling parameters timings 
A journey has a duration that is used to calculate the trajectories of parameters against the time.   
The parameters may not have quite the same rhythm.   
Each can have its own duration (limited to the maximum duration of the trip).   
Each can decide to start at another point in the cycle.    
### additional option in a parameter's journey definition 
#### wait_ms 
A parameter can delay its start by setting *wait_ms* 
If wait_ms is not defined, wait_ms is set to 0 : the journey of the parameter starts with the global journey.    
#### duration_ms 
A parameter can have a shorter duration than the globale one.
If not defined, the parameter's duration is the duration of the journey. 
#### checked conditions 
*wait_ms + duration_ms* of each parameter must be less or equals to the global duration.  
If not, *duration_ms* is truncated to end with the global duration_ms.
#### samples 
```javascript 
var journey = {
  duration_ms: 10000, // duration of the journey
  // array of parameters in this journey
  parameters: [
    {
      name: "position", 
      wait_ms: 8000,
      duration_ms: 1000, 
      start: [0, 100, 0], 
      end: [-50, -200, -600], 
      easingOnT: (t)=>t*t*t
    },
    {
      name: "rotation", 
      duration_ms: 6000,
      end: [150, 230, 0], 
      easingOnT: easingOnT_flip_t2
    },
    {
      name: "fill.color", 
      duration_ms: 3000,
      start: [50, 50, 50], 
      end: [100, 200, 255],
    },
    {
      name: "fill.color", 
      wait_ms: 3500, 
      duration_ms: 2000,
      end: [255, 255, 255], 
    },
    {
      name: "fill.color", 
      wait_ms: 7000,
      end: [0, 200, 200], 
    },
  ]
}
``` 
The timing looks like :     
|++++++++++| global journey of 10s 10000 ms  
|========+=| position movement, postponed of 8000 ms  and will last 1 second , 1000 ms.      
|++++++====| rotation movement , start at beginning ( no wait_ms ) and last 6 second, 6000 ms.      
One can see the dragon rotates its head, have a 2 seconds pause, then move back quickly.  
2 seconds more later, the journey end and goes back to scenario to start next script if any. 

### repeated parameters 
Parameters runs natively in paralell. Using wait_ms and duration_ms allows to reuse the same parameter at different timing like *fill.color* in the example above :  
dragon's color move to [100, 200, 255] (pale blue) in 3 seconds, from there (no start defined) turns [255, 255, 255] (white), then stays as is 1,5 seconds, then turns [0, 200, 200] (blue-green) in 3 seconds.   
1,5 s is the time between end of second movement at 5,5s  : wait_ms 3500, duration_ms 2000   and the start of the last movement : 7s wait_ms 7000.  
3 s is the time of the last movement : no duration_ms is defined, so it is adjusted to the remaining time.
#### some tip for rotation 
The end destination of a rotation can involves several turns from start angle. Just set a high value for degrees like 720 for two turns from 0, etc.  
## code organisation 
One can imagine to make a huge journey for all the life of an object, repeating parameters several times : bad idea.  
A good cutting will use all the levels of framework :   
 A scenario can have an array of scripts to play in sequence, some being journeys.     
 A scenario can start scenarios in paralell with a precise schedule.  

#### see next : camera movements 