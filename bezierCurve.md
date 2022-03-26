# 
# beziers curve 
We will use quadratic bezier curve (see wikipedia)
To design a trajectory from a start point to an end point, two anchors can be used to pull up the default rope.   
## bezier parameters : 2 x 2 coordinates 
```javascript 
var conf = {
  start: [300, 0, 0],
  end: [-300, 0, 0],
  bezier: {
    inter1: [220, -210, 0],
    inter2: [-220, -210, 0],
  }
};
```
### bezier helper 
The sketch in bezierHelper shows the curve done with the previous conf :   
<img src = "./img/forDoc/bezier1.png" width = 400> </img>   
start point is green, end point is red, inter1 is yellow and inter2 is orange    
Lets see others configurations :
---
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
- fill in the conf literals with start and end you want to travel 
- If no idea, give inter1 and inter2 values of start and end : they will be superimposed.  
- use keyboard helper using keyboard key and console : 
  -  key x, y or z to choose an axis to move on 
  -  key 0, 1, 2 or 3 to choose element to move : start point, end point, inter1 point, inter2 point 
  -  key  > to advance on the choosen axis or key < to move back 
  -  key enter to see on the console the new values of conf : 
  
 <img src = "./img/forDoc/bezier5.png" width = 400> </img>  <img src = "./img/forDoc/bezier6.png" width = 200> </img>  

 You can copy values in the console and put it in place of your previous conf to mark the job.    

 ### using a Bezier conf in a journey configuration 
 You just have to add the two bezier points into the action of a journey : 
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
When framewok encounters a bezier part, it will replace the default linear interpolation by the bezier curve.   
#### any type of object can move on a bezier trajectory    
As a journey can apply to any moveable object, Bezier can be used for moving a model , for a camera movement, etc. 
### Tip effect:  Bezier out of range   
Maths precise the curve is valid in the range 0..1  , but what happens if you go outside ? 
In the following, we draw a bezier from -0.2 to 1.2 :    
 <img src = "./img/forDoc/bezier7.png" width = 400> </img>   
One can see that the curve accelerates and prolongates the trajectory.   
This can be used to make an object disappear with a fast effect.  
For that, you must imagine a special *easingOnT* function that goes outside 0..1 

#### see also : using keyboard helper  



  