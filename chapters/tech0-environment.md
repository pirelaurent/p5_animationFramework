# Environment 
## Visual studio code 
Few to explain.   
The integrated terminal is automatically in the current folder, allowing to type *commands*, or  *git* instruction or to start *batch*.  
The first line in sources :   
```///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />```   
is to have code completion and autodocumentation for p5.     
It introduces a drawback as this line is not in the exec code, so lines number given in errors don't match for 1 step with the line number in vsc.   
##### .gitignore for vsc
 Get latest from https://github.com/github/gitignore/blob/master/VisualStudio.gitignore      

## Local web server 
After a while with some trouble with node simple server, i go to **python http server**.    
Just have to strike in terminal ( mac or pc )  
```python3 -m http.server 8081 ```

as i prefer having a script that launch the http server **and** the navigator on the right place, i use script on mac : 
```  
#!/bin/zsh
# has to be run from terminal by ./py.command  in the project folder 
# it starts automatically a chrome nav. It will say 'unavailable' until python starts 
open -a /Applications/"Google Chrome.app" "http://localhost:8081" 
# start module http. Be aware port # be the same as chrome. I use to have a port # per project. 
python3 -m http.server 8081
```
### some troubles 
When reloading full js ( with cmd shift R  on mac), as the order is not guarantee, sometime load fails.  
Retry several times to go ahead.   
One day, it will be packaged with a tool that respect dependancies... 


## others tools useful
### Gimp 
 Very useful for dealing with images and prepare textures 
### Blender
Blender to create or modify .obj models.    
Rather a high step to start with.    
I use it mainly to scale and to rotate obj found on the web, as p5 uses a less common *left hand coordinates* with y down. I prefer to have these obj centered to 0 and the head up.  
#### util/utilGeometry.js  
If you have no time to learn Blender and are happy with code, have a look on the *util/utilGeometry.js* i design to act on an already loaded model for some rectifications.See code. 


