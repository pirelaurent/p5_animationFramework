/*
 some tests to valid algorithms 
*/
function updateTest() {
    console.log(" test1: update Config controlled ");
    var original = {
      simpleValue: 10,
      composed: { a: 10, b: "bb" },
    };
  
    var resu = patchConfig(original, {
      simpleValue: 33,
      composed: { b: "baby" },
    });
  
    console.assert(resu.simpleValue == 33, 'resu.simpleValue == 33');
    console.assert(resu.composed.a == 10, 'resu.composed.a == 10');
    console.assert(resu.composed.b == "baby",'resu.composed.b == "baby"');
    //-----------
    console.log(" test2: update Config controlled with unknow key : must give error");
    var original = {
      simpleValue: 10,
      composed: { a: 10, b: "bb" },
    };
    var resu = patchConfig(original, {
      simplevalue: 33, // mispelling here 
      composed: { b: "baby" },
    });
    console.assert(resu.simpleValue == 10,'resu.simpleValue == 10'); // stay unchangeed
    console.assert(resu.composed.a == 10,'resu.composed.a == 10');
    console.assert(resu.composed.b == "baby",'baby unchanged');
    //---------
    console.log(" test3: extends Config with unknow keys allowed ");
    var original = {
      simpleValue: 10,
      composed: { a: 10, b: "bb" },
    };
    var resu = extendConfig(original, {
      anotherValue: 100,
      composed: { d: true },
      anotherComposed: { x: 10, y: 20, z: 30 },
    });
    console.assert(resu.anotherValue == 100,'resu.anotherValue == 100'); // added
    console.assert(resu.composed.a == 10,'resu.composed.a == 10'); // unchanged in collection
    console.assert(resu.composed.d == true,'resu.composed.d == true'); // added in collection
    console.assert(resu.anotherComposed.x == 10,'resu.anotherComposed.x == 10'); // a new collection with data
    console.assert(resu.anotherComposed.y == 20,'resu.anotherComposed.y == 20'); // a new collection with data
    console.assert(resu.anotherComposed.z == 30,'resu.anotherComposed.z == 30'); // a new collection with data
  
    //---------
    console.log(" test4: update Config with keys of different types : give warning");
    var original = {
      simpleValue: 10,
      composed: { a: 10, b: "bb" },
    };
    var resu = extendConfig(original, {
      simpleValue: { x: 10, y: 20, z: 30 },
      composed: { a: null },
    });
    console.assert(typeof resu.simpleValue == "object",'typeof resu.simpleValue == "object"');
    console.assert(resu.simpleValue != 10,'resu.simpleValue != 10');
    console.assert(resu.simpleValue.y == 20,'resu.simpleValue.y == 20');
    console.assert(resu.composed.a == null,'resu.composed.a == null');
    console.assert(resu.composed.b == "bb",'resu.composed.b == "bb"');
    //---------
    console.log(" test5: update Config with keys of different types : give warning");
    var original = {
      simpleValue: 10,
      composed: { a: 10, b: "bb" },
    };
    var resu = extendConfig(original, {
      composed: 33,
    });
    console.assert(resu.simpleValue == 10,'resu.simpleValue == 10');
    console.assert(resu.composed == 33,'resu.composed == 33');
    //------
    console.log(" test6: update Config with empty modifier . will have no change");
    var original = {
      simpleValue: 10,
      composed: { a: 10, b: "bb" },
    };
    var resu = extendConfig(original, {
    });
    console.assert(resu.simpleValue == 10,'resu.simpleValue == 10');
    console.assert(resu.composed.a == 10,'resu.composed.a == 10');
    console.assert(resu.composed.b == "bb",'resu.composed.b == "bb"');
  //----------
  console.log(" test7: normal case with color parameter ");
  var original = {
      color1: "black",  // string color name
      color2: "#FF00FF77", // string hexadecimal 
      color3: [200,200,0], // array RGB
      color4: [200,200,0,100], // array RGB Alpha
      color5: "white",
      color6: color(100,100,100) // function color can be used in code, not in static
    };
  var resu = extendConfig(original,{
      color1: [0,0,0], 
      color2: "red", 
      color3: "blue",
      color4: "#FF00FF77",
      color5: color(100,50), // special can be used in code, not in static
      color6: 'red'
  })
  // cannot compare (color5 == color(100,50)) as this will be different instances of Color 
  // use internal values 
  console.assert(red(resu.color5) == 100,'resu.color5==color(100,50)')
  console.assert(blue(resu.color5) == 100,'resu.color5==color(100,50)')
  console.assert(green(resu.color5) == 100,'resu.color5==color(100,50)')
  console.assert(alpha(resu.color5) == 50,'resu.color5==color(100,50)')

  console.assert(resu.color6 == "red",'resu.color6 == "red"')

  console.log("------------ end of tests -------------")
  }