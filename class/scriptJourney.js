function* scriptJourney(journey, anObject) {  
    // add internal data to complete parameters list
    for (var aParam of journey.parameters) {
      aParam.isStarted = false;
      aParam.isEnded = false;
      // start later ? 
      if (! aParam.wait_ms) aParam.wait_ms = 0;
      // personal duration ? If none take the remaining time   
      if (!aParam.duration_ms) aParam.duration_ms = journey.duration_ms - aParam.wait_ms; // later can have their own different timing
      // Common errors i have done 
      var errata = false; 
      errata = errata ||(aParam.duration_ms+aParam.wait_ms)>journey.duration_ms;
      errata = errata ||(aParam.duration_ms<=0)
      if (errata){
        console.warn(`parameter ${aParam.name} has wrong duration_ms: start at ${aParam.wait_ms} duration_ms: ${aParam.duration_ms}`);
        aParam.isEnded = true;
        continue;
      }
      if((journey.duration)||(aParam.duration)){
        console.warn(`Use duration_ms not duration : param ${aParam.name} rejected `);
        continue;
      }
    }
    // the generator has done the upper only once , now continue
    var startTime = millis();
    var elapsedTime = 0;
    /*
    main loop of this generator. It follows time until full elapsed 
    */
    while (elapsedTime <= journey.duration_ms) {
      elapsedTime = millis() - startTime;
      // loop on parameters
      for (var aParam of journey.parameters) {
        // nothing to do conditions 
        if (aParam.isEnded) continue;
        if (elapsedTime < aParam.wait_ms) continue; // too early 
        if (elapsedTime > aParam.wait_ms+aParam.duration_ms) { // to late 
          aParam.isEnded = true;
          continue;
        }
        // if first time in the flow
        if (!aParam.isStarted) {
          aParam.isStarted = true;
          // if no start value, take the current value of parameter 
          if (!aParam.start) aParam.start = anObject.getData(aParam.name);
          // calculate once the distance between end and start
          if (Array.isArray(aParam.start)) {
          aParam.delta = [];
          for (var i = 0; i < aParam.end.length; i++) {
            var delta =aParam.end[i] - aParam.start[i]
            aParam.delta.push(delta);
          }
          // not array, simple value 
        } else aParam.delta = (aParam.end - aParam.start)
        }

        // calculate current proportion of time from 0 to 1
        var t = (elapsedTime - aParam.wait_ms)/ aParam.duration_ms;

        // is there a time function defined in the journey for this parameter 
        if( aParam.easingOnT) {
           t = aParam.easingOnT(t);
        }

        // add to start value(s) the proportion of distance . Array or simple value first :
        if (Array.isArray(aParam.start)) {
          // calculate a new vector cell per cell 
          var newV=[];
          for (var i=0;i<aParam.start.length;i++){
           newV.push(aParam.start[i] + aParam.delta[i] * t);
          }
          anObject.setData(aParam.name, newV);
        } else {
          anObject.setData(aParam.name, aParam.start + aParam.delta * t);
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