 // future config part of a bezier in a journey 
 var conf = {
  start: [200,-400,-200], 
  end:   [20,50,350], 
  bezier: {
    inter1: [-380,-370,-240], 
    inter2: [-450,250,310] 
 }
};

var firstIndex01, lastIndex01; // used to change colors if beziers calculated outside 0..1
var s_start, s_end, s_inter1, s_inter2; // sphere to see what happens
var trajet = [];
// calculation from 0 to 1 
var from_t= -0.2;
var to_t = 1.2; 

// a special trace to re create the previous format 
function traceConf(){
  var s = `start: [${s_start.config.position}], \n end:   [${s_end.config.position}], \n`;
  s+= ` bezier: {\n   inter1: [${s_inter1.config.position}], \n   inter2: [${s_inter2.config.position}] \n}`;
  console.log(s);
}


function setup() {
  var can = createCanvas(800, 800, WEBGL);
// change a bit point of view with a tripod 
  camera1 = createCamera();
  tripod1 = new Tripod({
    name: "tripod 1",
    position: [0, -220, 800], // point of view to see the grid
  });
  tripod1.mountCamera(camera1);

  createBezierSpheres()

  
 // change default help 
  kb.showAxis = true; 
  kb.showGrid = true;
  kb.objectsToMove=[];
  // 0 1 2 3 4
  kb.objectsToMove.push(s_start); 
  kb.objectsToMove.push(s_end);
  kb.objectsToMove.push(s_inter1);
  kb.objectsToMove.push(s_inter2);
  kb.objectsToMove.push(tripod1);  //4
  // move default inter1
  kb.toMove = kb.objectsToMove[2];
  // change enter behavior 
  kb.enter = traceConf;
}

function calculateTrajet(from, to, startV, endV, inter1V, inter2V) {
  trajet = [];
  var t0 = from;
  var t1 = to;
  var stepT =(t1-t0)/50;
  var t = t0;

  while (t <= t1) {
    trajet.push(calculateBezier(startV, endV, inter1V, inter2V, t));
    if (t < 0) firstIndex01 = trajet.length;
    if (t <= 1) lastIndex01 = trajet.length;
    t += stepT;
  }
}

function draw() {
  background(50);
  orbitControl(1, 1, 1);
  kbHelp();
  s_start.draw();
  s_end.draw();
  s_inter1.draw();
  s_inter2.draw();

// calcul of a series of points that will be drawn later 
 // change to vectors 
 var p = s_start.config.position;
 var startV = createVector(p[0], p[1], p[2]);
  p = s_end.config.position;
  var endV = createVector(p[0], p[1], p[2]);
  p = s_inter1.config.position;
  var inter1V = createVector(p[0], p[1], p[2]);
  p = s_inter2.config.position;
  var inter2V = createVector(p[0], p[1], p[2]);
  // calculate a series of points 
  calculateTrajet(from_t,to_t, startV,endV,inter1V, inter2V);
  // now draw points 
  for (var i = 0; i < trajet.length; i++)
    for (aPoint of trajet) {
      aPoint = trajet[i];
      paint = "smoke";
      if (i < firstIndex01) paint = "green";
      if (i > lastIndex01) paint = "red";
      // materialize 
     push();
     stroke(paint); 
     translate(aPoint.x, aPoint.y, aPoint.z);
     sphere(5);
     pop();
    }
}

function calculateBezier(startV, endV, inter1V, inter2V, t) {
  var a = p5.Vector.lerp(startV, inter1V, t);
  var b = p5.Vector.lerp(inter1V, inter2V, t);
  var c = p5.Vector.lerp(inter2V, endV, t);
  var d = p5.Vector.lerp(a, b, t);
  var e = p5.Vector.lerp(b, c, t);
  return p5.Vector.lerp(d, e, t);
}

function createBezierSpheres(){
  // create graphics to have sphere to move using conf
  s_start = new GraphicObject(  {
    name: "start point",
    position: conf.start,
    stroke: { active: true, color: "green", weight:0.3 },
    fill:{active:false},
  });
  s_start.drawModel= ()=>sphere(20)

   s_end = new GraphicObject(  {
    name: "end point",
    position: conf.end,
    stroke: { active: true, color: "red", weight:0.3 },
    fill:{active:false},
  });
  s_end.drawModel= ()=>sphere(20)

  s_inter1 = new GraphicObject(  {
    name: "inter1 point",
    position: conf.bezier.inter1,
    stroke: { active: true, color: "yellow",weight:0.3 },
    fill:{active:false},
  });
  s_inter1.drawModel= ()=>sphere(20)

  s_inter2 = new GraphicObject(  {
    name: "inter2 point",
    position: conf.bezier.inter2,
    stroke: { active: true, color: "orange", weight:0.3},
    fill:{active:false},
  });
  s_inter2.drawModel= ()=>sphere(20)
}



//     //--------- chrome  Command Shift F pour virer le haut
//     case "-": {
//       cacherBarreEtCurseur();
//       break;
//     }
//     case "+": {
//       restaurerBarreEtCurseur();
//       break;
//     }

//   }

//}
