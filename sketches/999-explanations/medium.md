# control animations with js generators.   
I was involved in a show for a cyber-opera to realize 3D visual animations.  
For this request, I developed a use of the generators which i wish to share.   
A generator is a special function declared with a star : ```myFunction*  ```    
A simple one with the goal to animate a simple ball: 
``` javascript
function* animate(){
    ball.color = "red"
    ball.radius = 100;
    yield "ball is ok" 
    ball.radius = 200;
    ball.color  = "blue";
    yield 200 
    while (ball.radius < 400) { 
        ball.radius += 10
        yield
    }
}
```
## The two times of a generator    
A generator is not exactly a function, rather a kind of class which is instantiated at first call and results in a new object :    
```var animation = animate();```   
Later, each time we call``` animation.next() ```the code advance into the function* up to the next yield.    
The return can be checked by :    
```let step = animation.next(); ```  
```if( ! step.done) console.log(step.value);```   
with this code, console will show echoes of the yield xx :    
*ball ok    
200    
(20) undefined  *  

Using yield to return a request for a break     
In an animation, timing is paramount. We decide to use yield returned value as a number of milliseconds to wait.    
```javascript   
function* animate(){
 ball.color = "red"
 ball.radius = 100;
 yield 3000; // ball will stay red for 3000 milliseconds (3s)
 ball.radius = 200;
 ball.color = "blue";
 yield 2000 // ball will stay blue and radius 200 for 2000 ms (2s)
 while (ball.radius < 400) { // ball will grow blue each second up to 400 
  ball.radius += 10
  yield 1000 
 }
}
```
### Scenario to pilot the timing 
Some code must be in charge to advance the generator on its next() function call and to wait the number of ms returned by the yield : a Scenario 
```javascript   
class Scenario {
 constructor(aGenerator){
 this.generator = aGenerator;
}
start(){
 console.log("scenario starts");
 this.animation= this.generator();
 this.advance();
}
advance() {
 var step = this.animation.next();
 if (!step.done) {
  var nextDueDate = step.value;
 // postpone its job , but wants to be recalled with its scenario context
this.timeoutId = setTimeout(this.advance.bind(this), nextDueDate);
} else { 
 console.log("scenario is ended")
}}} 
```