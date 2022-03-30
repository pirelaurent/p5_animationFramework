# a framework to animate your P5 sketches 
This work comes from a realization made for a cyber Opera where graphics animations where needed.   
P5 allows many primitives to animate objects, but a framework appears as imperative to stay in schedule.  
This is a review of what was learned in this adventure. 

## chapter 0 : basic objects 
To have something to move and draw, a hierarchy of three classes : 
- **MoveableObject**    to hold basic elements like position or rotation.  
- **GraphicObject**     to define some specific shape to draw itself in place
- **GraphicObjectModel**  same as previous using an external model (.obj, .stl) or some other Geometry   

## chapter 1 : Literals in a class hierarchy
Documentation of the framework functions around literals objects.   
See file : **chap1-literals.md**
## chapter 2 : scenario 
A scenario is a way to schedule steps of animation in a practical way.   
Explanations and basic samples can be found in file **chap2-scenario.md**   

## chapter 3 : basic movement 
How to create a journey to modify any parameters in time.  
Use generic description to define all your trajectories.

# Advanced animations 

## chapter 4 : define variation along time 
How to define speed variations for a trajectory using functions to vary estimated time.  

## chapter 5 : decoupling time between parameters 
You can give more precise timing to your parameters inside a same journey so that they don't all leave at the same time or last the same duration

## chapter 6 : use Beziers curves in space 
Design easily and use Bezier trajectories in your journeys.  

# use camera
## chapter 7 : put your camera on a Tripod 

