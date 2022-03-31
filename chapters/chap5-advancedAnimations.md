# More advanced animations 
## decoupling time for parameters in a same journey
A journey has a duration that is used to calculate the trajectories of the named parameters against the time.   
In real life, the parameters may not have quite the same rhythm.   
Each one can have its own duration (limited to the maximum duration of the trip).   
Each one can decide to start at another point in the cycle.   
If the needs are quite simple, a single journey can be accomodated to do the job.  
(If more complex needs, create several scenarios and coodinate them.)   


### more optional keys in a parameters definition 
#### wait_ms 
A parameter can delay its start by setting *wait_ms*    
If *wait_ms* is not defined,it is set to 0 : the parameter starts with the start of the journey.    
#### duration_ms 
A parameter can have a shorter duration than the globale one.   
If not defined, the parameter's duration is the duration of the journey.  
Some controls are applied : 
 *wait_ms + duration_ms* must be less or equals to the global duration.  
 If not, *duration_ms* of parameter is truncated.  
#### sample
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
  ]
}
``` 
The timing for position and rotation looks like :     
|++++++++++| global journey of 10s 10000 ms  
|========+=| position movement, postponed of 8000 ms  and will last 1 second , 1000 ms.      
|++++++====| rotation movement , start at beginning ( no wait_ms ) and last 6 second, 6000 ms.      
One can see the dragon rotates its head, have a 2 seconds pause, then move back quickly.  
2 seconds more later, the journey end and goes back to scenario. 

### repeated parameters in a same journey

```javascript  
parameters: [
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
    }
]
```
Using *wait_ms* and *duration_ms* allows to reuse the same parameter at different timing.   
The parameter *fill.color* in the example above is used three times with chained timing :  
*dragon*'s color move to [100, 200, 255] (pale blue) in 3 seconds,  
After a while of half second (3500 - 3000) it turns to white [255, 255, 255] from its current color (no start value), in 2s.   
White stays for 1,5 seconds (7000 - 3500 -2000 ), then turns [0, 200, 200] (blue-green) in 3 seconds.
Note : if definitions overlapped for the same parameter, the last one in the list will win.     

#### some tips about rotation 
The end destination of a rotation can involves several turns from start angle.  
Just set a high value (here DEGREES ) like 720 for two turns from 0, etc.  
## about 
A good code will use all the levels of framework :   
 A scenario can have an array of scripts to play in sequence, some being journeys or specific generators.     
 A scenario can start scenarios in parallel with a precise schedule: This can help to separate concerns (like having a scenario for movement, another for aspect, etc.)   
 Keep journey multiparameters for simple cases.    
