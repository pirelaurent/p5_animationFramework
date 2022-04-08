# About Cyber Opera "Terres rares"  
This framework was designed to realize animations for a cyber Opera in France.  
This gallery to give ideas with some creations in p5 with this framework.     

## cyber opera 
<img src = './affiche.png' height = 240>   
<img src = './live.png' height = 240>
 <img src = './totem.png' height = 240>

The display (on right) is a 3840 height x 1080 width composed of two huge screens in portrait mode.    
I develop with such a canvas in P5 and use two monitors connected to a mac M1.   
Below some (rather low quality) images to show what we can do with p5 and webgl.
### moon climbing 
<img src = './moon.png' height = 240>   

p5:  
The background was created using a perlin noise effect. It uses transparency colors and enlightment in background.       
The moon is climbing slowly on a Bezier trajectory and go away very fast at end using a Bezier end a bit out of range 0..1

### mining robot 
<img src = './robot.png' height = 240>   

An animated mining robot progresses through a cave while analysing lanthanid spectrum.  
p5:  
using multiple layers of p5 instances with canvas superimposed.   
Using local rotation for antenna and world rotation for the whole robot.   
Various lighting .


### genius of nature
<img src = './treeman.png' height = 240>     

Some kind of mythological genie travels through space, slowly spins around, and generates tufts of grass that fall to the ground.    
p5:  
Several objects are moving and each one runs its own scenario and has its own trajectory.    
A .obj is visually cloned 6 times in the *drawModel* method with a variable operture angle managed by a scenario.

### Medusa 
<img src = './flyingbats.png' height = 240>

Medusa rides some kind of monster which turns out to be a group of bats taking off as it goes.  
p5:  
Grouping, ungrouping of models.   
Autonomous fly for each bat with a built-in scenario in class.  
Colors effects in time.    

### Computer & IA 
<img src = './computer.png' height = 240>   

p5:   
A nod to the history of computing with a set of PDP-11s in the ground topped with a quantum computer that is doused in a rising rain of binary and an array of hexadecimal numbers.   
Background code scrolling.   
Multiple animated layers with instances of p5, on-the-fly cache of generated text to be used as graphics images in webgl.   




