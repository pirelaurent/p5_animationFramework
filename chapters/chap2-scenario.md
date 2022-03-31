# Scenarios 
A *scenario* takes care of timing & scheduling to start, stop or wait for parts of your code.   
(Samples are coded as p5.js sketches, but scenario can be used in any js environment. )   

## scenario 
A **scenario** plays a **script**, or a series of **scripts**.    
Once a script is finished, the scenario runs the next one.    
### script vs  generator

A **generator** is a special function characterized by a declaration with a star : ```myFunction*```    
When this function is called directly,```myFunction()```, it **instanciates** an object, a kind of class holding the source code and internal variables.  
=>a **script** in the framework holds the generator's function and an *instance* of this *generator*   

To execute the code of a generator, one must call its method **next()** on its instance.   
The code advance up to a **yield** instruction or up to its own end and returns to caller.    
To continue, caller must call again *next()*

We call a **step** a part of generator's code that run without being interrupted   
*beginning*-----step 0-----**yield**--step 1---**yield**--- etc---**yield**--- last step ---*end*
## how a scenario interacts with the underlaying generators
When a scenario starts, it get the first *generator* of its list and create an instance.   
Once started, scenario call the generator to run the next step.    
The generator executes the step then returns either by : 
- **yield** -> The scenario will wait the default *interval* ms of the scenario before calling again the script
- **yield** xxxxx   -> The scenario will wait the number xxxxx of ms before calling the next step   
- a **return** instruction  -> The scenario will stop this script . 
- the *end* of generator's code.    -> Same as above. 
    
When the script returns to the scenario *advance* method, **this method push itself in the js event loop for later**:    
 ``` javascript 
 advance() {
    var step = this.script.instance.next();
    if (!step.done) {
      var nextEcheance =
        step.value == undefined ? this.config.interval : step.value;
      // postpone its job , but wants to be recalled with its scenario context
      this.timeoutId = setTimeout(this.advance.bind(this), nextEcheance);
    } else {
      this.stopScript();
    }
  }
 ```  
This code loops until the end of the code's script, step by step.    
**Notice the *.bind(this)* to relate the future with the current scenario.**  
## how it stops 
A script stop when the end of its code is reached or when its scenario is stopped.   
A scenario can be stopped at any time with the method ```scenario.stop()```    
A scenario ends naturally when the last script of its array of scripts is ended.   
## miscellaneous about scenarios 
- Once a scenario is ended, one can restart it from beginning by **myScenario.restart()**.  
=> *start* or *restart* will create a fresh instance of the generator allowing to reuse it several times.     
- Several scenarios can be started and can run in parallel with their own scheduling.  
- The code inside a generator can start or stop another scenario.     
- If useful, a scenario can wait the end of another in a script by pooling its status regularly:   
```while (!theOther.isEnded) yield 100```

# Simple example : a p5 sketch traffic_lights  
The goal is to enlight a (european) traffic lights with defined durations  
<img src = "../img/forDoc/traffic_lights4.png" width = 200></img>   
## TrafficLight class
A class to hold infos as a literal object *config*.   

``` javascript  
class TrafficLight {
  constructor(name) {
    this.config = {
      name: name,
      visible: true,  // drawn or not 
      active: false, // lights stay all grey
      lights: {
        green: { active: false, colors: { on: "#3ADF00", off: "#243B0B" }, duration_ms: 3000 },
        orange: { active: false, colors: { on: "#FFBF00", off: "#61380B" }, duration_ms: 1000 },
        red: { active: false, colors: { on: "#FF0000", off: "#3B0B0B" }, duration_ms: 4000 },
      },
    };
  }
  
  draw() {
    if (!this.config.visible) return;
    ... do the job
 }
  ```   
### script to animate lights and scenario to run the script
First, be aware of the special notation ```function*``` which means this is a *generator* not a simple function.     
Each yield can return a number of <u>milliseconds</u> to wait before coming back.   
As we want a full time animation, the script has an infinite loop inside ```while(true)```    
function *patchConfig* changes only the keys given as variants. *(see chap1-literals)*

``` javascript 
function* europeanScript(oneTrafficLight) {
 // activate the traffic light box
 oneTrafficLight.config.active = true;
 let lights = oneTrafficLight.config.lights;// local relay for readability
 while (true) {
   //-------- set red
   patchConfig(lights, {green: {active: false }, orange: {active: false }, red: {active: true },});
   yield lights.red.duration_ms;
   //---------- set green
   patchConfig(lights, {
     green: {active: true },orange: {active: false },red: {active: false },});
   yield lights.green.duration_ms;
   //---------- set orange
   patchConfig(lights, {
     green: {active: false },orange: {active: true },red: {active: false },});
   yield lights.orange.duration_ms;
 } // while
}
```
## create the scenario  
The constructor of a scenario has two parameters, a config for scenario itself and an array of generators.   
```constructor(someConfig = {}, generatorsToUse = []) ```   
If you look at the Scenario class, you'll find a default configuration which can be used as is or patched:     
```javascript 
  static defaultConfig = {
    scenarioName: "Scenario noname",
    interval: 60, //ms of wait if yield doesn't return a specific value
    trace: false,
  };
  ```  
  When creating an instance, one can give all config or only the differences to apply :   
   ``` javascript   
 let europeanScenario1 = new Scenario(
    { scenarioName: "european lights 1", trace: true },
    [  // array of scripts for this scenario . Here just one 
      { scriptName: " lights 1", generator: europeanScript, arguments: [traffic_1] });
    ]
```
### Array of scripts   
To have a generic scenario , the generators are described in two separated entries : 
- the generator: only the **function name**  DON'T PUT ANY PARENTHESIS AFTER : *europeanScript*   
- an optional array of argument's values if their is.  
  Our has one : *arguments: [traffic_1]*    
This way allows to keep an agnostic scenario engine with any kind of generators, with or without params.   
This way allows to reuse generators are they are instanciated *inside* the scenario in *start* or *restart*.   

## external scenario vs scenario internal to the class 
In the sketch example, we draw 4 traffic lights.    
The first traffic_light is animated by the scenario seen above: *europeanScenario1*.  
The second one has a similar scenario using the same generator but using another config: 
```javascript
 europeanScenario2 = new Scenario(
    { scenarioName: "european lights 2", trace: true },
    { scriptName: " lights 2", generator: europeanScript, arguments: [traffic_2] });
  ```   
Any scenario can be established this way. 
### create a scenario internal to a class 
When thinkink about, the blinking red-green-orange is a dedicated traffic light behavior.    
It can be a good idea to make the scenario and the script part of the *TrafficLights class*.   
We will explore two different ways for traffic_3 and traffic_4:    

#### generator as a class method 
For traffic_3 we use an exact copy of the previous script except the declaration.   
As a method we omit the *function* keyword but keep the **star** to indicate a generator : 
    ``` *internalEuropeanScript(oneTrafficLight) { ```   
The associated scenario is created in the constructor.   
The arguments' list of generator now reference **this** : 
```javascript
    this.lightsScenario = new Scenario(
      { scenarioName: "lightsScenario3", trace: true },
      { scriptName: "european ligths 3", generator: this.internalEuropeanScript, arguments:[this]}
    );
```   
Now scenario is part of object and can be started by: ```  traffic_3.lightsScenario.start(); ```   

#### an internal generator without parameter

For traffic_4 the idea is : "why still using a parameter as we know we are in the object ?"  
A modified generator script *_internalEuropeanScript_()*, is without parameter.  
References to previous parameter *oneTrafficLight*, is replaced by *this*:   
```javascript    
  * _internalEuropeanScript_() {
        this.config.active = true; // was oneTrafficLight.config.active = true;
        etc // all oneTrafficLight replaced by this 
```   
The scenario is created in the constructor for demo purposes : 
```javascript 
      this.lightsScenarioBis = new Scenario(
        { scenarioName: "lightsScenario4", trace: true },
        { scriptName: "european ligths 4", generator: this._internalEuropeanScript_.bind(this)}
      );
```  
Notice that there is no more *arguments* entry in literal as this generator has no parameter.   
Scenario is part of traffic_4 object and can be started as: ```  traffic_4.lightsScenarioBis.start(); ```   

#### Tips: .bind (this)
 **a generator is detached of the context** ( as will be any anonymous function).    
Without indication, *this* is not known inside the generator.  
Binding the function with *this* allows to use *this* inside the script.   


# Now the results 
## using p5 to draw in 3D 
In the main prog, in the *setup* function of P5, we create the lights.      
Later, in the *draw* method, we ask the traffic lights to draw themselves at a given position.   
Next, a **master scenario** will be in charge to start each TrafficLight's personal scenarios.
``` javascript 
function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.position(0, 0);
  traffic_1 = new TrafficLight("pole 1");
  traffic_2 = new TrafficLight("pole 2");
  traffic_3 = new TrafficLight("pole 3");
  traffic_4 = new TrafficLight("pole 4");
// create external scenarios
   europeanScenario1 = new Scenario(
    { scenarioName: "european lights 1", trace: true },
    { scriptName: " lights tempo", instance: europeanScript(traffic_1) });
   europeanScenario2 = new Scenario(
    { scenarioName: "european lights 2", trace: true },
    { scriptName: " lights tempo", instance: europeanScript(traffic_2)});

  // a general scenario is setup to synchonized the both sides of the road 
  masterScenario = new Scenario(
    { scenarioName: "master", trace: true },
    { scriptName: " launcher", generator: launchScript }
  );
  // start master which will start others 
  masterScenario.start();
}

function draw() {
  orbitControl(1, 1, 1);
  background(60);
  //(positionning and rotation omitted below. See code)
     traffic_1.draw();
     traffic_2.draw();
     traffic_3.draw();
     traffic_4.draw();
}
```   
#### master scenario script 
To have traffic_lights synchronized, the scenarios must start by pairs with a delay.      
We use a master scenario whose script launches the other scenarios at the right time : 
```javascript 
function* launchScript() {
  // start first pair on red
  console.log('-->start first pair of lights')
  europeanScenario1.start();
  europeanScenario2.start();
  // red is 7s, green 4s and orange 1s. To have both red overlapped:
  yield 6000;
  console.log('-->start second pair of lights')
  traffic_3.lightsScenario.start();
  traffic_4.lightsScenarioBis.start();
  console.log('------ operational crossroads ------ ')
}
```
Now traffic lights are synchronized and run for ever   
<img src= "../img/forDoc/FourLightsOnRoad.png" width = 400></img>




#### stop the scenarios
A question could be : how to stop these behaviours as we have an infinite loop in the scripts ?    
Any scenario has a *stop* method and we can check if it is already ended by the property *isEnded*.   
Here we stop all after 60s (if not yet stopped) : stop the scenario, put all the lights off. 

```javascript 
/// the scenarios run for ever. We stop it after some time to conclude this tuto
  if (!europeanScenario1.isEnded) { // avoid to redo once terminated
    if (millis() > 60000) {
      console.log("------ general stop ------")
      europeanScenario1.stop(); // stop scenario
      traffic_1.config.active = false; // turn off the lights
      europeanScenario2.stop();
      traffic_2.config.active = false;
      traffic_3.lightsScenario.stop();
      traffic_3.config.active = false;
      traffic_4.lightsScenarioBis.stop();
      traffic_4.config.active = false;
    }
  }
}
```
####  scenario.startGlobalMs
In the code above, we have used ```millis()```which is the elapsed time since **the sketch** is running.   
We could have used the exact elapsed time since the scenario was started :   
```if( millis() - europeanScenario1.startGlobalMs > 60000 )  ```     

#### trace of scenario  
As we start scenarios with *{trace: true}* , we can follow the story on the console: 
<img src= "../img/forDoc/lightsTrace.png" width=300></img>




# summary 
A *scenario* cooperate with a *generator* to advance code automatically under a controlled schedule.  
A generator can execute any js code in its current context (whole app, object instance,..) or through its own function parameters. 
### next chapter : basic movement 
One main use of scenarios in graphic design is about movements.  A specific ready to use generator has been designed in the framework : *scriptJourney*    
See **chap3-basicMovement.md** 


  





