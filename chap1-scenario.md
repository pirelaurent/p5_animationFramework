# chap1 - Scenarios 
A *scenario* takes care of timing & scheduling to start, stop or wait for parts of your code.   
(Samples are coded as p5.js sketches, but can run in any js environment. )   
## scenario 
A **scenario** plays a **script**, or a series of **scripts**.    
Once a script is finished, the scenario runs the next one.    
### script : instance of a generator
A **script** is an *instance* of a javascript *generator* (function *)   
A **generator** executes any javascript code up to the next **yield** instruction or its own end.   
When a yield instruction is found, the generator code stops and returns to caller.   
When caller calls it again, it continues its code after the yield where it stops.   
#### step 
One step into a generator function is a part of code that run without being interrupted:  
- from beginning to first yield
- from yield to yield 
- from last yield to end of code. 

## how a scenario interacts with the underlaying generators
When a scenario starts, it get the first *generator* of its list, create a *script*, ie an instance of the generator (by a first call that run nothing), then ask the generator to go (next()) and generator run its first *step*.   
The generator returns either by : 
- yield                 -> The scenario will wait the default *interval* ms of the scenario before calling again the script
- yield xxxxx   -> The scenario will wait the number xxxxx of ms  
- a return instruction  -> The scenario will quit this script and take the following if any
- the end of generator.    -> Same as above. 
  
The scenario has an *advance* function that calls the next step of the script: ```script.instance.next()```   
When the script return, *advance* push itself in the js event loop for later:    
 ```this.timeoutId = setTimeout(this.advance.bind(this), nextEcheance);```  
When awaked by this timeout, *advance* calls the script again. 
Just start the scenario and all will run in time, following the scripts and the defined *yield*
## how it stops 
A scenario stops when the last script of its collection is ended.   
A scenario can also be stopped at any time with the method ```scenario.stop()```
## miscellaneous about scenarios 
Once a scenario is ended, one can restart it from beginning by *myScenario.restart()*
Several scenarios can be started when needed : they run in parallel with their own scheduling.  
As a generator is javascript, inside a generator code can start or stop another scenario.
A scenario can wait the end of another scenario by pooling the status of the other :  ```while (!theOther.isEnded) yield 100```

# Simplified Example in sketches: traffic_lights  
The goal is to enlight a (european) traffic lights with defined durations  
## TrafficLight class
A class to hold infos as a literal object *config*.    
``` javascript  
class TrafficLight {
  constructor(name) {
    this.config = {
      name: name,
      visible: true,
      active: false, // lights stay all grey
      lights: {
        green: { active: false, colors: { on: "#3ADF00", off: "#243B0B" } },
        orange: { active: false, colors: { on: "#FFBF00", off: "#61380B" } },
        red: { active: false, colors: { on: "#FF0000", off: "#3B0B0B" } },
      },
    };
  }
  
  draw() {
    if (!this.config.visible) return;
    push(); // P5 save context
    this.drawHousing();
    // add three lights sphere
    noStroke();
    translate(0, 50, 20); this.drawLight("green");
    translate(0, -50, 0); this.drawLight("orange");
    translate(0, -50, 0); this.drawLight("red");
    pop();
  }
  // draw the named light
  drawLight(colorName) {
    let opt = this.config.lights[colorName];
    if (opt.active && this.config.active) fill(opt.colors.on); else fill(opt.colors.off);
    sphere(20);
  }
 }
  ```   
## script to animate lights
First, be aware of the special notation ```function*``` which means this is a *generator* not a simple function.     
Each yield can return the number of <u>milliseconds</u> to wait before coming back.   
As we want a full time traffic_lights animation, the script has an infinite loop ```while(true)```    
function *patchConfig* changes only the keys given as parameters. *(see chap2-literals)*

``` javascript 
function* europeanScript(oneTrafficLight) {
  // activate the traffic lights red, green, orange and loop 
  var lights = oneTrafficLight.config.lights; // simplify access path
  while (true) {
    patchConfig(lights, { green: { active: false }, orange: { active: false }, red: {active: true}});
    yield 3000+random(5000)  //( we use some random for pleasure)   
    patchConfig(lights,{ green: { active: true },red: { active: false }});
    yield 2000 + random(2000);
    patchConfig(lights, { green: { active: false },orange: { active: true }});
    yield 1000 + random(1500); 
  } // while
} 
```
## create the scenario to run the script  
   ``` javascript   
 let europeanScenario1 = new Scenario(
    { scenarioName: "european lights 1", trace: true },
    [  // array of scripts for this scenario
      { scriptName: " lights 1", generator: europeanScript, arguments: [traffic_1] });
    ]
```
If you look at the Scenario class, you'll find a default definition that the previous will patch:     
```javascript 
  static defaultConfig = {
    scenarioName: "Scenario default noname",
    interval: 60, //ms of wait if yield don't return a specific value
    trace: false,
  };
  ```
### Array of scripts   
To have a generic scenario , the generators are described in two separated entries : 
- the generator: only the **function name**  DON'T PUT ANY PARENTHESIS AFTER : *europeanScript*
- an optional list of arguments if the generator is defined with.  
- Our is defined with one argument : ```function* europeanScript(oneTrafficLight)``` 
### understanding the two times of a generator 
You declare a generator as a  ```function *```     
The first time one call this function will instanciate the generator.
A scenario instanciate the generator in its *start()* method.  
If the scenario is restarted (restart()), a fresh instance will be made :  this allows to reuse several times the same generator function. 
Once started, the scenario calls the current generator instance in its *advance* method that calls the generator *next()* function. 

This way allows to have a agnostic scenario that can run any type of generators with or without variant params. 
## external scenario vs internal scenario 
In the example, we draw 4 traffic lights.    
<img src = "./img/forDoc/traffic_lights4.png" width = 200></img>   
### external 
The first two one are animated by scenarios created in main code as seen previously.  
The code of the associated script is the ```function* europeanScript(oneTrafficLight)```  described above.    

### internal  
When thinkink about, the blinking is a dedicated traffic light behavior.    
So, it can be a good idea to make the scenario and the script part of the *TrafficLights class*.  
That's what was done for traffic_3 and traffic_4 to illustrate two ways to do it. 
#### generator as a class method 
For traffic_3 we use an exact copy of the previous script except the declaration.   
As a method we omit the *function* keyword but keep the star to indicate a generator : 
    ``` *internalEuropeanScript(oneTrafficLight) { ```   
The scenario is created at construct time and the arguments list reference *this* : 
```javascript
    // add on in constructor for example traffic_3 
    this.lightsScenario = new Scenario(
      { scenarioName: "lightsScenario", trace: true },
      { scriptName: "european ligths", generator: this.internalEuropeanScript, arguments:[this]}
    );
```   
to start scenario of traffic_3: ```  traffic_3.lightsScenario.start(); ```   

#### an internal generator without parameter
For traffic_4 the idea is : "why still using a parameter as we know we are in the object ?"  
A modified generator script, without parameter, uses *this* as the destination of actions.
```javascript    
  * _internalEuropeanScript_() {
        this.config.active = true; // in place of previous oneTrafficLight.config.active = true;
        ...
```   
#### Expert tip:  function.bind 
 **a generator is detached of the context** ( as can be any anonymous function ).   
without effort, *this* is not known inside the generator and scenario will crash. 
To relate the generator function to the context, we need to bind it : 
``` javascript
 //add on for example traffic_4 
      this.lightsScenarioBis = new Scenario(
        { scenarioName: "lightsScenarioBis", trace: true },
        { scriptName: "european ligths Bis", generator: this._internalEuropeanScript_.bind(this)}
      );
```  
Scenario can be started as: 
```  traffic_4.lightsScenarioBis.start(); ```   

# P5 drawing in 3D 
In the main prog, in the *setup* function of P5, we create the lights and we start the 4 scenarios.   
Later, in the draw method, we ask the traffic lights to draw themselves.   
``` javascript 
function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.position(0, 0);
  traffic_1 = new TrafficLight("pole 1");
  traffic_2 = new TrafficLight("pole 2");
  traffic_3 = new TrafficLight("pole 3");
  traffic_4 = new TrafficLight("pole 4");
// external scenarios
   europeanScenario1 = new Scenario(
    { scenarioName: "european lights 1", trace: true },
    { scriptName: " lights tempo", instance: europeanScript(traffic_1) });
   europeanScenario2 = new Scenario(
    { scenarioName: "european lights 2", trace: true },
    { scriptName: " lights tempo", instance: europeanScript(traffic_2)});
// start all 
  europeanScenario1.start();
  europeanScenario2.start();
// using class scenario
  traffic_3.lightsScenario.start();
  traffic_4.lightsScenarioBis.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(60);
  translate(-150, -100, 0);  traffic_1.draw();
  translate(100, 0, 0);  traffic_2.draw();
  translate(100, 0, 0);  traffic_3.draw();
  translate(100, 0, 0);  traffic_4.draw();
}
```   
#### stop the scenarios
A question could be : how to stop these behaviour as we leave an infinite loop in the script ? 
Any scenario has a stop method and we can check if it is already ended by a property. 
In the scketch example, the scenarios are stopped after a while with code like this : 
```javascript 
// the scenario runs for ever. We stop it after 1 mn to conclude this tuto
if(millis()>60000){
  if(!europeanScenario1.isEnded) europeanScenario1.stop();
  traffic_0.active = false;
}
```
#### tip : scenario times 
In the code above, we have used ```millis()```which is the elapsed time since the sketch is running.  
We could have used another time : the exact elapsed time of the scenario since it starts :   
```if( millis() - europeanScenario1.startGlobalMs > 60000 )  ```  

# summary 
- javascript generators are used to create code with defined steps, separated by yield.  
- A scenario  activates the generator to advance one step. 
- Generator returns some value by a *yield*. If no value a default value is used by scenario. 
- Scenario waits the numer of ms (an asynchronous timeout) before calling again the generator.  
- Internal scenarios help to add embedded animated behavior to objects. 
- External scenarios may pilot from independant animations up to large stories. 
  








