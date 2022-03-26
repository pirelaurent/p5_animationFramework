 // future config part of a bezier in a journey 
 var conf = {
  start: [260,130,230], 
  end:   [70,-280,0], 
  bezier: {
      inter1: [220,-340,120],
      inter2: [380,160,-240] 
  }
};



var firstIndex01, lastIndex01; // used to change colors if beziers calculated outside 0..1
var s_start, s_end, s_inter1, s_inter2; // sphere to see what happens
var trajet = [];

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

  // create graphics to have sphere to move using conf
  s_start = new GraphicObject(  {
    name: "start point",
    position: conf.start,
    stroke: { active: true, color: "green" },
    fill:{active:false},
    drawModel:()=>sphere(20)
  });

   s_end = new GraphicObject(  {
    name: "end point",
    position: conf.end,
    stroke: { active: true, color: "red" },
    fill:{active:false},
    drawModel:()=>sphere(20)
  });

  s_inter1 = new GraphicObject(  {
    name: "inter1 point",
    position: conf.bezier.inter1,
    stroke: { active: true, color: "yellow" },
    fill:{active:false},
    drawModel:()=>sphere(20)
  });

  s_inter2 = new GraphicObject(  {
    name: "inter2 point",
    position: conf.bezier.inter2,
    stroke: { active: true, color: "orange" },
    fill:{active:false},
    drawModel:()=>sphere(20)
  });
 // change default help 
  kb.showAxes = true; 
  kb.showGrid = true;
  kb.objectsToMove=[];
  // 0 1 2 3
  kb.objectsToMove.push(s_start); 
  kb.objectsToMove.push(s_end);
  kb.objectsToMove.push(s_inter1);
  kb.objectsToMove.push(s_inter2);
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
      sph(aPoint, paint, 5);
    }
}

function sph(v, color = "grey", size = 8) {
  push();
  stroke(color);
  translate(v.x, v.y, v.z);
  sphere(size);
  pop();
}

function calculateBezier(startV, endV, inter1V, inter2V, t) {
  var a = p5.Vector.lerp(startV, inter1V, t);
  var b = p5.Vector.lerp(inter1V, inter2V, t);
  var c = p5.Vector.lerp(inter2V, endV, t);
  var d = p5.Vector.lerp(a, b, t);
  var e = p5.Vector.lerp(b, c, t);
  return p5.Vector.lerp(d, e, t);
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
