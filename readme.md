# a framework to animate your P5 sketches 
This work comes from a realization made for a cyber Opera where complex graphics animations where needed.   
P5 allows many primitives to animate objects, but a framework appears as imperative to stay in schedule.  
This is a review of what was learned in this adventure. 

## chapter 1 : scenario 
A scenario is a way to schedule steps of animation in a practical way.   
Explanations and basic samples can be found in file **chap1-scenario.md**   
## chapter 2 : basic moveable elements 
A series of class, based on a common ancester, allows to display and move graphicals elements in 3D.   
To help the dev, sample is given to move the elements with keyboard keys and js console.   
Explanations and basic samples can be found at ***moveable elements.md*** 
## Utilities 
### Literals as configuration structures 
The framewok make a heavy use of literals as class parameters or to hold class variables.  
To facilitate dev and code, several utilities are around these literals : 
- copy a configuration  
- patch a configuration with key controls : can only patch existing keys in the previous configuration
- extend a configuration : can patch but also add new entries in the structure.   
- extract from a configuration a subconfiguration : allows to read several named data in an existing configuration 
Some details can be found in file ***Literals.md***    

  


