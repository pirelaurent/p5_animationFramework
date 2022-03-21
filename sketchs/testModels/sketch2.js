/*
 à voir l'intérêt du set par rapport à un patchConfigControlled
 par contre, on n'a pas de get interprété;
 peut-on faire directement un {disp.stroke.color[1]} dans une config ??
*/

function preload() {}

var config;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.position(0, 0);
  config = {
    name: "myObject",    // to facilitate debug, give a name to objects
    visible: true,      // if false object is not drawn
    position: [0, 0, 0],// current location of object
    stroke: { active: true, color: "white", weight: 1 },
    fill: { active: false, color: [200,100,100] },
  };
 
      //moreComplex:[{"un":1},{"deux":2},{"trois":{"plus":33}}]
//benchAccess();
return;

  // accès en lecture
  console.assert(getData(config, "disp.x") == 10);
  console.assert(Array.isArray(getData(config, "disp.position")));
  console.assert(getData(config, "disp.position[1]") == 200);
  console.assert(getData(config, "disp.stroke.color[3]") == 100);
  // can also use dot notation 
  console.assert(getData(config, "disp.stroke.color.3") == 100);
  // test en écriture
  setData(config, "disp.x", 13);
  console.assert(getData(config, "disp.x") == 13);
  setData(config, "disp.position[2]", 333);
  console.assert(getData(config, "disp.position[2]") == 333);
  // check that set returns also the value 
  console.assert(setData(config, "disp.stroke.color[2]",22) == 22);
 // more complex .remember: indice 0 is "un"
  console.assert(getData(config,"disp.moreComplex[1].deux")==2)
  console.assert(getData(config,"disp.moreComplex[2].trois.plus")==33)
  // can also use .notation 
  console.assert(getData(config,"disp.moreComplex.2.trois.plus")==33)
// check errors in get 
  console.assert(getData(config,"display.x")==null);
  console.assert(getData(config,"disp.y")==null);
  console.assert(getData(config,"disp.stroke.color[4]")==null);
  console.assert(getData(config,"disp.stroke.color.4")==null);
// same in set 
}

function draw() {}




