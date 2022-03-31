# A framework to animate your P5 sketches 
This work comes from a realization made for a cyber Opera where graphics animations where needed.   
P5 allows many primitives to animate objects, but a framework appears as imperative to stay in schedule.  
This is a review of what was learned in this adventure. 

## chapter 0 : basic objects 
To have something to move and draw, a hierarchy of three classes : 
- **MoveableObject**    to hold basic elements like position or rotation.  
- **GraphicObject**     to define some specific shape to draw itself in place
- **GraphicObjectModel**  same as previous using an external model (.obj, .stl) or some other Geometry   
#### code examples
sketches/0-basicObject   
sketches/1-cupOfCoke 

## chapter 1 : Literals and class hierarchy
Documentation of the framework functions around literals objects.   
See file : **chap1-literals.md**

## chapter 2 : scenario 
A scenario is a way to schedule steps of animation in a practical way.   
Explanations and basic samples can be found in file **chap2-scenario.md**  
#### code example
sketches/2-trafficLights

## chapter 3 : basic movement 
How to create a journey able to make variations of any data in time.  
Use generic descriptions to define expected start and end values for the journey.
#### code example
sketches/3-basicMovement 

## chapter 4 : define variation along time 
How to define speed variations for a trajectory using functions to modify estimated time.  
#### code example
sketches/4-advanceMovement 
sketches/990-showCurvesOnTime 

## chapter 5 : decoupling time between parameters 
You can give more precise timing to your parameters inside a same journey so that they don't all start at the same time or last the same duration. 
#### code example
sketches/5-advanceMovement 

## chapter 6 : use Beziers curves in space 
Design easily and use Bezier trajectories for your parameters.  
Learn to design a Bezier with an helper using keyboard.  

#### code example
sketches/6-beziersTrajectory
sketches/991-bezierHelper 

## chapter 7 : move a camera using a tripod 
Defining a tripod as a moveable element and mounting a camera on this tripod allows to set it in any scenario to apply movements to the camera.   
#### code example
sketches/7-cameraLiberty 


# Miscelleanous 
can see tech0-environment.md 
 

