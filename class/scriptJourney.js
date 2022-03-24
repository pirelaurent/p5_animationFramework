function* scriptJourney(journey, anObject) {
    // add internal data to parameters list
    for (var aParam of journey.parameters) {
      aParam.isStarted = false;
      aParam.isEnded = false;
      aParam.durationMs = journey.durationMs;  // later can have their own different timing
    }
  
    // on suit le temps
    var startTime = millis();
    var elapsedTime = 0;
    /*
    main loop of this generator. It follows time until elapsed 
    */
    while (elapsedTime <= journey.durationMs) {
      elapsedTime = millis() - startTime;
      // loop on parameters
      for (var aParam of journey.parameters) {
        if (aParam.isEnded) continue;
        if (elapsedTime > aParam.durationMs) {
          aParam.isEnded = true;
          continue;
        }
        // if first time, take the right values
        if (!aParam.isStarted) {
          // if no start in journey take current value
          if (!aParam.start) aParam.start = anObject.getData(aParam.name);
          aParam.isStarted = true;
          console.log(` param start ${aParam.name}: ${aParam.start}`);
        }
        // calculate current proportion of time from 0 to 1
        var t = elapsedTime / aParam.durationMs;
        // is there a time function defined in the journey for this parameter 
        if( aParam.easingOnT) {
           t = aParam.easingOnT(t);
        }


        //console.log(` param ${aParam.end} ${Array.isArray(aParam.end)}`);
        // add to start value(s) the proportion of distance . Array or simple value first :
        if (Array.isArray(aParam.start)) {
          if (!aParam.delta) {
            aParam.delta = [];
            for (var i = 0; i < aParam.end.length; i++) {
              var delta =aParam.end[i] - aParam.start[i]
              //console.log(`delta on ${aParam.name}  ${delta}`)
              aParam.delta.push(delta);
            }
          }
          var newV=[];
          for (var i=0;i<aParam.start.length;i++){
           newV.push(aParam.start[i] + aParam.delta[i] * t);
          }
          anObject.setData(aParam.name, newV);
        } else {
          var v = aParam.start + (aParam.end - aParam.start) * t;
          anObject.setData(aParam.name, v);
        }
      }
      yield  // return to caller for a pause using current interval of scenario
    } //end while
  }

  function easingOnT_t2(t) {return t*t};
  function easingOnT_t3(t) {return t*t*t};
  function easingOnT_t4(t) {return t*t*t*t};

  function easingOnT_flip_t2(t) { var flip = 1-t; return 1 - flip*flip};
  function easingOnT_flip_t3(t) {var flip = 1-t; return 1 - flip*flip*flip};
  function easingOnT_flip_t4(t) {var flip = 1-t; return 1 - flip*flip*flip*flip};