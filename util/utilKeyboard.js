/*
 helper to p5 with keyboard 
 Active your debug console ( cmd option i ) or through nav menu 
 Add kbHelp() in your draw loop 
 Use keyboard to add/retract/see/change parameters and options  
*/

//-------------- some global to use with keyboard---------
var kb = {
  showAxes: false,
  showGrid: false,
  objectsToMove: [], // to set to a list of moveable objects
  toMove: null,
  axisToMove: 0, // default indice 0,1,2 for x, y, z
  stepToMove: 10, // default step for a deplacement
  stepToRotate: 15, // default step for a rotation DEGREES
  modeToMove: "position", // either rotation
  enter: traceCurrentObject, // kb.enter can be overriden to do something else in context 
};
// set default trace 
function traceCurrentObject() {
  if (!kb.toMove) console.log("no object to trace");
  else {
    console.log(`${kb.toMove.config.name}:`);
    console.log(` position : [${kb.toMove.config.position.toString()}]`);
    console.log(` rotation : [${kb.toMove.config.rotation.toString()}]`);
  }
}

// to be added in the draw loop
function kbHelp() {
  if (!kb.infoDone) {
    console.log(' type "h" to see helper functions with keyboard');
    kb.infoDone = true;
  }
  if (kb.showAxes) utilAxis();
  if (kb.showGrid) debugMode(GRID, 800, 80);
  else noDebugMode();
}

function keyTyped() {
  console.log("*** keyTyped:" + key);
  let pos;
  switch (key) {
    case "Enter":
      kb.enter();
      break;
    case "a":
      kb.showAxes = !kb.showAxes;
      break;
    case "g":
      kb.showGrid = !kb.showGrid;
      break;
    // movements
    case "x":
      kb.axisToMove = 0;
      break;
    case "y":
      kb.axisToMove = 1;
      break;
    case "z":
      kb.axisToMove = 2;
      break;
    case "/":
      if (kb.modeToMove == "position") kb.modeToMove = "rotation";
      else kb.modeToMove = "position";
      break;
    case ">":
      if (!kb.toMove) break;
      if (kb.modeToMove == "position") {
        pos = kb.toMove.config.position;
        pos[kb.axisToMove] += kb.stepToMove;
      } else {
        pos = kb.toMove.config.rotation;
        pos[kb.axisToMove] += kb.stepToRotate;
      }
      break;

    case "<":
      if (!kb.toMove) break;
      if (kb.modeToMove == "position") {
        pos = kb.toMove.config.position;
        pos[kb.axisToMove] -= kb.stepToMove;
      } else {
        pos = kb.toMove.config.rotation;
        pos[kb.axisToMove] -= kb.stepToRotate;
      }
      break;
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
      var i = parseInt(key);
      if (i < kb.objectsToMove.length) {
        kb.toMove = kb.objectsToMove[i];
        console.log(kb.toMove.config.name + " ready to move");
      } else kb.toMove = null;
      break;
    // help
    case "h":
      var help = `
               **** Keyboard option **** 
               a: show axes 
               g: show grid 
               x,y,z : select axis for a deplacement 
               > <  : advance , move back element to move one kb.stepToMove (default 20) 
               / : toggle move vs rotate  
               0..9 : element to move (index in objectsToMove array)

               `;
      console.log(help);
  }
}
