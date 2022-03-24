# Advanced animation - 2
## Decoupling parameters destiny 
A journey has a duration that is used to calculate the trajectories of parameters against the time.   
The parameters may not have quite the same rhythm.   
Each can have its own duration (limited to the maximum duration of the trip).   
Each can decide to start at another point in the cycle.    
### additional option in a parameter's journey definition 
#### durationMS 
A parameter can apply its change in its own duration by setting *durationMs* 
If not defined, the parameter's duration is the duration of the journey. 
#### waitMs 
A parameter can delay its start by setting *waitMs* 
If waitMs is not defined, the journey of the parameter starts at the global journey beginning. 
#### samples 
