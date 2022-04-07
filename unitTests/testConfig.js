var configTest = {
  // boolean
  visible: true,
  // composed
  position: { x: 0, y: 0, z: 0 },
  // composed with bool, array, number
  stroke: { active: true, color: [100, 100, 200], weight: 0.2 },
  // array of composed
  steps: [
    { x: 10, y: 100, z: 10 },
    { x: 20, y: 200, z: 120 },
    { x: 40, y: 300, z: 600 },
  ],
};


function testUpdates() {
  console.log("----- test update(config,subconfig) ------");
  let config = copyProperties(configTest);
  let subConfig;
  // simple
  subConfig = { visible: false };
  patchProperties(config, subConfig);
  console.assert(visible == false, traceConfig(subConfig));
  subConfig = { position: { y: 30 } };
  patchProperties(config, subConfig);
  console.assert(position.y == 30, traceConfig(subConfig));
  // tests other unchanged
  console.assert(position.x == 0, traceConfig(subConfig));

  // composed
  subConfig = { stroke: { weight: 1 } };
  patchProperties(config, subConfig);
  console.assert(stroke.weight == 1, traceConfig(subConfig));
  // composed with indice in array
  // cannot design a litteral as {stroke:color[0]:200} us {0:...}
  subConfig = { stroke: { color: { 0: 200 } } };
  patchProperties(config, subConfig);
  console.assert(stroke.color[0] == 200, traceConfig(subConfig));
  console.assert(stroke.color[1] == 100, traceConfig(subConfig));
  console.assert(stroke.color[2] == 200, traceConfig(subConfig));

  console.log("--following test must rise a warning");
  subConfig = { stroke: { color: 10 } };
  patchProperties(config, subConfig);
  console.assert(stroke.color == 10, traceConfig(subConfig));

  console.log("--following test must rise a warning");
  subConfig = { stroke: { color: color("red") } };
  patchProperties(config, subConfig);
  // cannot compare two distinct returned objects by: stroke.color==color("red")
  // assuming it is a color, verify values
  console.assert(red(stroke.color) == 255, traceConfig(subConfig));

  console.log("----- test wrong update(config,subconfig) ------ ");
  config = copyProperties(configTest);
  console.log("--- typo errors ---");
  subConfig = { stroke: { Weight: 1 } };
  patchProperties(config, subConfig);
  console.assert(stroke.weight == 1, traceConfig(subConfig));
  subConfig = { position: { x: 20, Y: 30, z: 40 } };
  patchProperties(config, subConfig);
  console.assert(position.y == 30, traceConfig(subConfig));
  console.log("--- unknow key for update ---");
  subConfig = { fill:{active:false, color:"yellow"}}
  patchProperties(config, subConfig);
  console.log("-------------------------------")
}

function testExtend(){
    console.log("----- test extends(config,subconfig) ------");

}

function testCopy(){
    console.log("----- test copy(config)) ------");
    let bis= copyProperties(configTest);
    // verify serialisation-deserialisation 
    console.assert(JSON.stringify(bis)==JSON.stringify(configTest)," not same stringify ")
    // verify independancy of result 
    bis.stroke.weight = 1;
    console.assert(configTest.stroke.weight == 0.2," no independancy after copy")
}