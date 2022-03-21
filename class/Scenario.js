/*
 Scenario chains scripts,scripts chains steps, step = js code in a generator function

*/

class Scenario {
  static defaultConfig = {
    name: "Scenario no name",
    interval: 60, //ms of wait if yield don't return a specific value
    trace: false,
  };

  // create a scenario with one or several scripts 
  constructor(someConfig={}, generatorsToUse = []) {
    // copy default to separate instances config
    this.config = JSON.parse(JSON.stringify(Scenario.defaultConfig));
    // apply changes if any 
    this.config = patchConfig(this.config, someConfig);
   // 'polymorphism' new Scenario({name:'one'},aScript)  
   //                new Scenario({name:"more"},[script1,script2,script3])
   // if unique, embed it in an array.
    if (typeof generatorsToUse == "function")
      this.generatorsToUse = [generatorsToUse];
    else this.generatorsToUse = generatorsToUse;
    // to follow 
    this.currentGeneratorIndex = 0;
    this.isStarted = false;
    this.isEnded = false;
  }

  start() {
    // avoid successive call error
    if (this.isStarted) return;
    // avoid to start while ended is not cleared. Use restart
    if (this.isEnded) return;
    // prepare the script call with a method that can be externally overriden 
    // why that : some script can claim some specific parameters unknown of scenario 
   
    this.currentGeneratorIndex = 0;
    this.script = this.generatorsToUse[this.currentGeneratorIndex];
    this.setProgram();
    this.isStarted = true;
    this.startTimeMs = millis();
    this.startGlobalMs = millis();
    if (this.config.trace) {
      console.log("** start  scenario :" + this.config.name);
      console.log("start of " + this.script.name);
    }
    // first instruction is called asap
    this.advance();
  }

  // can restart a scenario when ended 
  restart() {
    this.isStarted = false;
    this.isEnded = false;
    this.start();
  }

  // stop everything
  stop() {
    this.isStarted = false;
    this.isEnded = true;

    if (this.config.trace) {
      var elapsed = round(millis() - this.startTimeMs) / 1000;
      var cumul = round(millis() - this.startGlobalMs) / 1000;
      //console.log("end of " + this.script.name + " after " + elapsed+' at:'+cumul);
      var secondes = (millis() - this.startGlobalMs) / 1000;
      var minutes = floor(secondes / 60);
      var solde = secondes - minutes * 60;
      console.log(
        ">>> end of scenario:" +
          this.config.name +
          " after " +
          minutes +
          " mn " +
          nf(solde, 2, 2) +
          " s"
      );
    }
    clearTimeout(this.timeoutId);
  }

  // If some parameter is to give to the script and you con't want to use globals, 
  // override the setProgram of your scenario to change way this.script is instanciated.
  setProgram() {
    this.program = this.script();
  }


  stopScript() {
    //console.log('index:'+this.currentGeneratorIndex+' '+this.generatorsToUse.length)
    if (this.config.trace)
      if (this.script.name != "scriptDeformation")
        // vu que c'est tjrs le meme nom
        console.log(
          "end of " +
            this.script.name +
            " after " +
            round(millis() - this.startTimeMs) / 1000
        );
    // full end
    if (this.currentGeneratorIndex == this.generatorsToUse.length - 1) {
      this.stop();
    } // end of a script start next
    else {
      this.currentGeneratorIndex += 1;
      this.script = this.generatorsToUse[this.currentGeneratorIndex];
      this.setProgram();
      this.startTimeMs = millis();
      if (this.config.trace)
        var elapsed = round(millis() - this.startTimeMs) / 1000;
      var cumul = round(millis() - this.startGlobalMs) / 1000;
      {
        console.log(
          "start of " +
            this.currentGeneratorIndex +
            " " +
            this.script.name +
            " at:" +
            cumul
        );
      }
      this.advance();
    }
  }



  // This method let a step run, harvest the yield returned value, 
  // create a timer to be itself reactivated and again up to end of generator.
  advance() {
    var instruction = this.program.next();
    if (!instruction.done) {
      var nextEcheance =
        instruction.value == undefined
          ? this.config.interval
          : instruction.value;
      // postpone its job , but wants to be recalled with its scenario context 
      this.timeoutId = setTimeout(this.advance.bind(this), nextEcheance);
    } else {
      this.stopScript();
    }
  }
}

