#  More advanced animations 
# beziers curve 
We will use quadratic bezier curve (see wikipedia)
To design a trajectory from a start point to an end point.  
Two anchors can be used to pull up the default rope.   
## bezier quadratic parameters : 2 x 2 coordinates 
```javascript 
 {
  start: [300, 0, 0],
  end: [-300, 0, 0],
  bezier: {
    inter1: [220, -210, 0],
    inter2: [-220, -210, 0],
  }
};
```
### bezier helper 
The sketch in *bezierHelper* source code shows the Bezier curve.  
The trajectory designed by the above configuration is :   
<img src = "./img/forDoc/bezier1.png" width = 400> </img>   
start point is **green**, end point is **red**, inter1 is **yellow** and inter2 is **orange**    

---
Other configurations with same start and end:
``` javascript 
bezier: {
  inter1: [220,-650,0] 
  inter2: [-220,-660,0] 
}
```   
<img src = "./img/forDoc/bezier2.png" width = 400> </img>   
---
```javascript 
 bezier: {
   inter1: [220,-430,-30] 
   inter2: [-250,430,30] 
}
```
<img src = "./img/forDoc/bezier3.png" width = 400> </img> 
---

### bezier is a 3D curve 
With the helper and the *orbitcontrol* of p5, you can see the curve from any point of view and design a 3D travel: 
```javascript 
{
 start: [260,130,230], 
 end:   [70,-280,0], 
 bezier: {
   inter1: [220,-340,120] 
   inter2: [380,160,-240] 
 }
}
```
<img src = "./img/forDoc/bezier4.png" width = 400> </img> 

## how to design a Bezier curve 
The simplest manner is to use the sketch of BezierHelper :  
-> fill in the conf literals with start and end you want to travel at the beginning of code :  
```javascript 
 // future config part of a bezier in a journey 
 var conf = {
  start: [220,-280,320], 
  end:   [-270,-150,110], 
  bezier: {
    inter1: [40,-390,270], 
    inter2: [-170,-40,270] 
 }
};
```

-> If no idea to start , give *inter1* and *inter2* values close to  *start* and *end*.   
-> strike keyboard keys (be sure that the focus in on canvas, not in console)   
--> key x, y or z to choose an axis to move on  
--> key 0, 1, 2 or 3 to choose an element to move : 0-start point, 1-end point, 2-inter1 , 3-inter2   
--> key  > to advance on the choosen axis 
--> key < to move back on the choosen axis   
--> key *enter* to see on the console the new values of conf :  
  
 <img src = "./img/forDoc/bezier5.png" width = 400> </img>  <img src = "./img/forDoc/bezier6.png" width = 200> </img>  

 You can copy/paste this text from the console to the source code in helper to mark the job.    
 You can copy/paste this text from the console to the source of your journey parameters.    
 ##### more info in source code of utilKeyboard.js 
 
 ### using a Bezier conf in a journey configuration 
 You just have to add two bezier points into the action of a journey.  
 If you have designed trajectory with the Bezier sketch, you can copy(from console)/paste(to your journey code)    
 ```javascript 
 parameters: [
    {
      name: "position", 
      start: [260,130,230], 
      end:   [70,-280,0], 
      bezier: {
          inter1: [220,-340,120] 
          inter2: [380,160,-240] 
      }
}
``` 
When framewok encounters a Bezier part, it will replace the default linear interpolation of value by the Bezier curve.     
(You can of course also apply your *easingOnT* function to vary the speed along this non linear trajectory )

#### any type of object can move on a bezier trajectory    
Bezier route can be used for any parameter of any component. 
Main uses are moving a model, or moving  a camera.  

### Tip effect:  using Bezier out of range   
Maths precise that the curve is valid in the range 0..1  , but what happens if you go outside ?   
In the following, we draw a bezier from -0.2 to 1.2 :    
 <img src = "./img/forDoc/bezier7.png" width = 400> </img>   
One can see that the curve accelerates and prolongates the trajectory in an asymptotic way.   
This can be used to make special effects:  
You can give a special *easingOnT* function that goes outside 0..1.   
For the above example function is: ```easingOnT: (t)=> -0.2+ (1.4*t)```  
In such a case, the element will not go from start to end but from a place far under start at -0.2 and terminate far after normal end at 1.2.  

#### view in action 
The sketch *beziersTrajectory* show the following : 
A travel is factorized in order to be reused several times  : 
``` javascript 
var travel = {
  name: "position",
  start: [250, -160, -60],
  end: [-220, 10, -290],
  bezier: {
    inter1: [-190, 370, 240],
    inter2: [-50, -460, -480],
  },
};
``` 
<img src = "./img/forDoc/bezierSketch0.png" width = 400></img> 

The sketch define 4 reuses :    
- the outward journey , that will use implicit f(t) = t to go from start to end. 
```javascript 
var travel1 = copyConfig(travel);
var outWardJourney = { duration_ms: 10000, parameters: [travel1]};
```
- the return journey , that will use  ```f(t) = 1-t``` to go from end to start (white route) 
```javascript 
var travel2 = copyConfig(travel);
travel2.easingOnT= (t) => 1 - t;
var returnJourney = { duration_ms: 10000, parameters: [travel2]}
```
- Then the same round trip but far away by overriding the 0..1 limits of Bezier definition 
```javascript 
// reuse position movement and use beziers out of range 0..1 from -0.2 to 1.2  
var travelSpecial1 = copyConfig(travel);
travelSpecial1.easingOnT = (t) => -0.2 + (1.2+0.2) * t;
```
- Same as above but travel back by 1- f(t)   
```javascript 
var travelSpecial2 = copyConfig(travel);
travelSpecial2.easingOnT = (t) => 1 - (-0.2 + 1.4 * t);
```

  