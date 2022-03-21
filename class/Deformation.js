/*
 permet de regrouper des variations dans le temps sur x paramètres 

*/
class Deformation extends Scenario {
    constructor(aconfig, liste, cameleon) {
      // recopier pour autoriser des clones de config
      var config = JSON.parse(JSON.stringify(aconfig));
      super(config, liste);
      // hérite de   name, interval, trace
      this.cameleon = cameleon;
    }
  
    // overWrite default scenario to give parameters to script
    setProgram() {
      // on analyse la config
      if (!this.config.actions) console.error("missing actions in " + config);
  
      if (!this.config.script) this.config.script = scriptDeformation;
      var aScript = this.config.script;
      // nécessaire pour que le scénario n'aille pas plus loin
      this.generatorsToUse.push(aScript);
      this.script = aScript;
      this.program = aScript(this.config, this.cameleon);
    }
  }
  
  // partie appelée régulièrement par le scénario qui pilote
  // permet de changer conjointement plusieurs paramètres d'un caméleon
  
  function* scriptDeformation(config, cameleon) {
    var debug = false;// more logs 
    var durationMs = config.durationMs;
    var actions = config.actions;
    // transform actions data in vectors
    for (var anAction of actions) {
      anAction.isStarted = false;
      anAction.isEnded = false;
      // if no start description, take parameter as it is now
      if (!anAction.start)
        // ici c'est le paramètre
        anAction.startV = cameleon.getParameter(anAction.parameter);
      else
        anAction.startV = createVector(
          anAction.start[0],
          anAction.start[1],
          anAction.start[2]
        );
  
      anAction.endV = createVector(
        anAction.end[0],
        anAction.end[1],
        anAction.end[2]
      );
  
      // if  bezier, store parameter in vectors
      if (anAction.bezier) {
        var p = anAction.bezier.inter1;
        anAction.inter1V = createVector(p[0], p[1], p[2]);
        p = anAction.bezier.inter2;
        anAction.inter2V = createVector(p[0], p[1], p[2]);
        // trace au temps 0
        // var v = calculateBezier(
        //   anAction.startV,
        //   anAction.endV,
        //   anAction.inter1V,
        //   anAction.inter2V,
        //   0
        // );
        // console.log('bezier init') // ça colle
        // console.log(anAction.startV)
        // console.log(v)
      }
      // on peut avoir des temps différents par paramètre, plus court que le total
      if (anAction.durationMs) {
        // this duration can'be larger than the main one
        var d = min(anAction.durationMs, durationMs);
      } else anAction.durationMs = durationMs;
      // si un retard à l'allumage en tenir compte
      if (anAction.waitMs) {
        anAction.durationMs = min(
          anAction.durationMs + anAction.waitMs,
          durationMs
        );
      } else anAction.waitMs = 0;
      // if some defined start, set the cameleon parameter at this place
      if (anAction.start)
        cameleon.setParameter(anAction.parameter, anAction.startV);
      //console.log("initialement:")+anAction.parameter+' :'+anAction.startV
      //
      // on calcule le vecteur de la trajectoire . second is substract from first
      //var directionV = p5.Vector.sub(anAction.endV, anAction.startV);
      // on le découpe en millisecondes de trajets, à chaque appel, on le multipliera par le temps écoulé
      //anAction.directionVperMs = directionV.div(anAction.durationMs);
      // amélioration des courbes de temps
      var easing = anAction.functionOnT ?? "t";
      //console.log(easing)
      switch (easing) {
        case "t":
          anAction.easingOnT = (t) => t;
          break; // standard linéaire
        case "t2":
          anAction.easingOnT = (t) => t * t;
          break; // petit arrondi au démarrage smooth start
        case "t+(t-t2)":
          anAction.easingOnT = (t) => t+(t-t * t);
          break;
        case "t3":
          anAction.easingOnT = (t) => t * t * t;
          break; //  arrondi moins raide au démarrage
        case "t4":
          anAction.easingOnT = (t) => t * t * t * t;
          break; //  arrondi moins raide au démarrage
        case "endT2":
          anAction.easingOnT = function (t) {
            var flip = 1 - t;
            flip = flip * flip;
            return 1 - flip;
          }; // smooth end
          break;
        case "endT3":
          anAction.easingOnT = function (t) {
            var flip = 1 - t;
            flip = flip * flip * flip;
            return 1 - flip;
          }; // smooth end
          break;
        case "endT4":
          anAction.easingOnT = function (t) {
            var flip = 1 - t;
            flip = flip * flip;
            flip = flip * flip;
            return 1 - flip;
          }; // smooth end
          break;
        default:
          console.error("unknown functionOnT parameter:" + easing+ "use t or remove functionOnT");
      }
    } //for
  
    // on suit le temps
    var startTime = millis();
    var elapsedTime = 0;
    // main loop of this generator. It follows time
    while (elapsedTime <= durationMs) {
      elapsedTime = millis() - startTime;
  
      for (var anAction of actions) {
        // si elle est pas commencée, on passe à la suivante
        if (elapsedTime < anAction.waitMs) continue;
        // si elle est terminée, inutile de calculer pour rien
        if (elapsedTime > anAction.durationMs) {
          if(!anAction.isEnded){
          anAction.isEnded = true;
          if (debug)console.log('end of action : '+anAction.parameter+ ' at : '+elapsedTime)
        }
          continue;
        }
  
        // -------------si c'est la première fois, on recale le début à cause des waitMs
        if (anAction.isStarted == false) {
          if (debug)console.log('start of action : '+anAction.parameter+ ' at : '+elapsedTime)
          anAction.isStarted = true;
          // recalage à la position courante si le départ n'est pas défini dans la config
          if (anAction.waitMs != 0) {
            // copier coller , berk . No time
            if (!anAction.start)
              anAction.startV = cameleon.getParameter(anAction.parameter);
            else
              anAction.startV = createVector(
                anAction.start[0],
                anAction.start[1],
                anAction.start[2]
              );
          }
        }
        // -------------
  
        // goes to 0..1 range
        var t =
          (elapsedTime - anAction.waitMs) /
          (anAction.durationMs - anAction.waitMs);
        // easing on
        t = anAction.easingOnT(t);
        // if beziers, elapsed is set to interval 0..1  to get trajectory positionq
        if (anAction.bezier) {
          var directionV = calculateBezier(
            anAction.startV,
            anAction.endV,
            anAction.inter1V,
            anAction.inter2V,
            t // le temps
          );
        }
        // linéaire par défaut . on se sert du vecteur direction par ms qu'on recalcule
        else {
          var directionV = p5.Vector.sub(anAction.endV, anAction.startV);
          // on en prend t, le % du temps qui est entre 0 et 1
          directionV.mult(t);
          // qu'on ajoute au point de départ
          directionV.add(anAction.startV);
        }
        // common
        cameleon.setParameter(anAction.parameter, directionV);
  
        // on le découpe en millisecondes de trajets,
        //anAction.directionVperMs = directionV.div(anAction.durationMs);
        //var v = p5.Vector.mult(anAction.directionVperMs, elapsedTime);
        // on ajoute le nouveau segment au départ
        //if(elapsedTime<=anAction.durationMs) v.add(anAction.startV);
        //cameleon.setParameter(anAction.parameter, v);
  
        // update parameter
      }
      // on laisse le défaut du scénario. Mettre intervall=   dans la config (avec name et trace )
      yield; // 60;
    }
    /* 
    // non, ça provoque des recalages si plusieurs mouvements de même type dans la série
    // At the end, due to precision, goto the final endpoints
    for (var anAction of actions) {
  
      if (debug){
        console.log(anAction.parameter);
        console.log('is at:'+cameleon.getParameter(anAction.parameter))
        console.log('goes to:'+anAction.parameter+' '+ anAction.endV)
      }
      cameleon.setParameter(anAction.parameter, anAction.endV);
    } */
  }
  
  function calculateBezier(start, end, inter1, inter2, t) {
    var a = p5.Vector.lerp(start, inter1, t);
    var b = p5.Vector.lerp(inter1, inter2, t);
    var c = p5.Vector.lerp(inter2, end, t);
    var d = p5.Vector.lerp(a, b, t);
    var e = p5.Vector.lerp(b, c, t);
    return p5.Vector.lerp(d, e, t);
  }
  