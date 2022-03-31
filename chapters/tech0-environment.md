# Environment 
## Visual studio code 
Nothing to explain.   
The integrated terminal is automatically in the current folder, allowing to type *commands*, or  *git* instruction or to start *batch*.  
## Local web server 
After a while with some trouble with node simple server, i go to python http server.    
Just have to strike in terminal ( mac or pc )  
```python3 -m http.server 8081 ```

as i prefer having a script that launch the http server **and** the navigator on the right place, i use script on mac : 
```  
#!/bin/zsh
# has to be run from terminal by ./py.command  in the project folder 
# it starts automatically a chrome nav. It will say 'unavailable' until python starts 
open -a /Applications/"Google Chrome.app" "http://localhost:8081" 
# start module http. Be aware port # be the same as chrome. I use to have a different port per projects. 
python3 -m http.server 8081
```
## others tools  
### Gimp 
 Very useful for dealing with images and prepare textures 
### Blender
Blender to create or modify .obj models. 
Rather a high step to start with. 
I use it mainly to rotate obj loaded on the web, as p5 uses a less common *left hand coordinates* with y down.  
