function* scriptJourney(journey, anObject) {
  // add internal data to complete parameters list
  for (var aParam of journey.parameters) {
    aParam.isStarted = false;
    aParam.isEnded = false;
    // if no f(t) , set simplest one 
    if (!aParam.easingOnT) aParam.easingOnT = (t)=>t ; 
    // check where f(t) ends to adjust real position at end of the travel 
    if (aParam.easingOnT(1)!=1) aParam.adjust = false; else aParam.adjust = true; 



    // start later ?
    if (!aParam.wait_ms) aParam.wait_ms = 0;
    // personal duration ? If none take the remaining time
    if (!aParam.duration_ms)
      aParam.duration_ms = journey.duration_ms - aParam.wait_ms; // later can have their own different timing
    // Common errors i have done
    var errata = false;
    errata =
      errata || aParam.duration_ms + aParam.wait_ms > journey.duration_ms;
    errata = errata || aParam.duration_ms <= 0;
    if (errata) {
      console.warn(
        `parameter ${aParam.name} has wrong duration_ms: start at ${aParam.wait_ms} duration_ms: ${aParam.duration_ms}`
      );
      aParam.isEnded = true;
      continue;
    }
    if (journey.duration || aParam.duration) {
      console.warn(
        `Use duration_ms not duration : param ${aParam.name} rejected `
      );
      continue;
    }
    // if  bezier, store parameter in vectors
    if (aParam.bezier) {
      var p = aParam.bezier.inter1;
      aParam.bezier.inter1V = createVector(p[0], p[1], p[2]);
      p = aParam.bezier.inter2;
      aParam.bezier.inter2V = createVector(p[0], p[1], p[2]);
      p = aParam.end;
      aParam.endV = createVector(p[0], p[1], p[2]);
      // aParam.startV will be calculated when param starts on time
    }
  } // loop on param
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
      if (elapsedTime > aParam.wait_ms + aParam.duration_ms) { // to late
         // set to exact position on end in case time and step  don't adjust exactly 
        if( aParam.adjust)  anObject.setData(aParam.name,aParam.end);
        // done for this one 
        aParam.isEnded = true;
        continue;
      }
      // if first time in the flow
      if (!aParam.isStarted) {

        aParam.isStarted = true;
        // if no start value, take the current value of parameter
        if (!aParam.start) aParam.start = anObject.getData(aParam.name);
        // in case of bezier, prepare a vector
        let p = aParam.start;
        aParam.startV = createVector(p[0], p[1], p[2]);
        // calculate once the distance between end and start if [a,b,c]
        if (Array.isArray(aParam.start)) {
          aParam.delta = [];
          for (var i = 0; i < aParam.end.length; i++) {
            var delta = aParam.end[i] - aParam.start[i];
            aParam.delta.push(delta);
          }
          // not array, simple value
        } else aParam.delta = aParam.end - aParam.start;
      }

      // calculate current proportion of time from 0 to 1
      var t = (elapsedTime - aParam.wait_ms) / aParam.duration_ms;

      // distinguish elapsed time and estimated time 
        t = aParam.easingOnT(t);
      // if trajectory is bezier, calculate with formula 
      if (aParam.bezier){
        var newV = calculateBezier(aParam.startV, aParam.endV, aParam.bezier.inter1V, aParam.bezier.inter2V,t);
        anObject.setData(aParam.name, [newV.x,newV.y,newV.z]);
        continue;
      }
      // add to start value(s) the proportion of distance . Array or simple value first :
      if (Array.isArray(aParam.start)) {
        // calculate a new vector cell per cell
        var newA = [];
        for (var i = 0; i < aParam.start.length; i++) {
          newA.push(aParam.start[i] + aParam.delta[i] * t);
        }
        anObject.setData(aParam.name, newA);
        continue;
      } 
      // at least simple value
        anObject.setData(aParam.name, aParam.start + aParam.delta * t);
      
    } // for loop 
    yield; // return to caller for a pause using current interval of scenario
  } //end while
}

function easingOnT_t2(t) {
  return t * t;
}
function easingOnT_t3(t) {
  return t * t * t;
}
function easingOnT_t4(t) {
  return t * t * t * t;
}

function easingOnT_flip_t2(t) {
  var flip = 1 - t;
  return 1 - flip * flip;
}
function easingOnT_flip_t3(t) {
  var flip = 1 - t;
  return 1 - flip * flip * flip;
}
function easingOnT_flip_t4(t) {
  var flip = 1 - t;
  return 1 - flip * flip * flip * flip;
}

function calculateBezier(start, end, inter1, inter2, t) {
  var a = p5.Vector.lerp(start, inter1, t);
  var b = p5.Vector.lerp(inter1, inter2, t);
  var c = p5.Vector.lerp(inter2, end, t);
  var d = p5.Vector.lerp(a, b, t);
  var e = p5.Vector.lerp(b, c, t);
  return p5.Vector.lerp(d, e, t);
}
