/*
 Scenario chains scripts,scripts chains steps, step = js code in a generator function

*/

class Scenario {

  // create a scenario with an array of one or several scripts to chain  :
  //[{ name: "nameOfScript",generator },{ name: "nameOfScript",generator }...]
  //
  constructor(instanceProperties, generatorsToUse = []) {
    extendProperties(this,
      {
        scenarioName: "Scenario noname",
        interval_ms: 60, //ms of wait if yield don't return a specific value
        trace: false,
      } );
    if (instanceProperties != null) patchProperties(this,instanceProperties);

    this.generatorsToUse = generatorsToUse; // its an array of scripts
    // but if just one accept it and make it an array
    if (!(this.generatorsToUse instanceof Array))
      this.generatorsToUse = [this.generatorsToUse];
    // to follow
    this.currentGeneratorIndex = 0;
    this.isStarted = false;
    this.isEnded = false;
  }

  start() {
    // avoid successive call error
    if (this.isStarted) return "already started";
    // avoid to start while ended is not cleared. Use restart
    if (this.isEnded) return "already ended - use restart";
    // prepare the script call with a method that can be externally overriden
    // why that : some script can claim some specific parameters unknown of scenario

    this.currentGeneratorIndex = 0;

    this.script = this.generatorsToUse[this.currentGeneratorIndex];
    this.createInstanceGenerator();

    this.isStarted = true;
    this.script.startTimeMs = millis();
    this.startGlobalMs = millis();
    if (this.trace) {
      console.log("** start  scenario :" + this.scenarioName);
      console.log("start of " + this.script.scriptName);
    }
    // first instruction is called asap
    this.advance();
    return "scenario started"
  }

  createInstanceGenerator() {
    // instantiate this script generator with optional arguments using spread operator
    if (!this.script.arguments) this.script.arguments = [];
    if (this.trace) {
      console.log(
        "instantiate:" +
          this.script.scriptName +
          " with " +
          this.script.arguments.length +
          " args "
      );
    }
    this.script.instance = this.script.generator(...this.script.arguments);
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

    if (this.trace) {
      //var elapsed = round(millis() - this.script.startTimeMs) / 1000;
      //var cumul = round(millis() - this.startGlobalMs) / 1000;

      var secondes = (millis() - this.startGlobalMs) / 1000;
      var minutes = floor(secondes / 60);
      var solde = secondes - minutes * 60;
      console.log(
        ">>> end of scenario:" +
          this.scenarioName +
          " after " +
          minutes +
          " mn " +
          nf(solde, 2, 2) +
          " s"
      );
    }
    clearTimeout(this.timeoutId);
  }

  stopScript() {
    //console.log('index:'+this.currentGeneratorIndex+' '+this.generatorsToUse.length)
    if (this.trace)
      console.log(
        "end of " +
          this.script.scriptName +
          " after " +
          round(millis() - this.script.startTimeMs) / 1000
      );
    // full end
    if (this.currentGeneratorIndex == this.generatorsToUse.length - 1) {
      this.stop();
    } // end of a script start next
    else {
      this.currentGeneratorIndex += 1;
      this.script = this.generatorsToUse[this.currentGeneratorIndex];
      this.createInstanceGenerator();
      this.script.startTimeMs = millis();
      if (this.trace)
        //var elapsed = round(millis() - this.script.startTimeMs) / 1000;
        var cumul = round(millis() - this.startGlobalMs) / 1000;
      {
        console.log(
          "start of " +
            this.currentGeneratorIndex +
            " " +
            this.script.scriptName +
            " at:" +
            cumul
        );
      }
      this.advance();
    }
  }

  // This method let a step run, harvest the yield returned value,
  // create a timer to be re-called later and again up to end of generator.
  advance() {
    var step = this.script.instance.next();
    if (!step.done) {
      var nextEcheance =
        step.value == undefined ? this.interval_ms : step.value;
      // postpone its job , but wants to be recalled with its scenario context
      this.timeoutId = setTimeout(this.advance.bind(this), nextEcheance);
    } else {
      this.stopScript();
    }
  }
}
