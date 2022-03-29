# a framework to animate your P5 sketches 
This work comes from a realization made for a cyber Opera where graphics animations where needed.   
P5 allows many primitives to animate objects, but a framework appears as imperative to stay in schedule.  
This is a review of what was learned in this adventure. 

## chapter 0 : basic objects 
To have something to move and draw, a hierarchy of three classes : 
- **MoveableObject**    to hold basic elements like position or rotation.  
- **GraphicObject**     to define some specific shape to draw itself in place
- **GraphicObjectModel**  same as previous using an external model (.obj, .stl) or some other Geometry   
See file : **chap0-basicObjects.md**

## chapter 1 : Literals in a class hierarchy
Documentation of the framework functions around literals objects.   
See file : **chap1-literals.md**
## chapter 2 : scenario 
A scenario is a way to schedule steps of animation in a practical way.   
Explanations and basic samples can be found in file **chap2-scenario.md**   


  


