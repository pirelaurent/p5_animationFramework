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

/*
update(config, subConfig) 
- allows to replace tail value of a key, either simple or composed value
- key must exist .It is controlled to avoid typo errors 
- allows to patch an existing config with onlly changes
- the smallest subConfig can be a single key to update  

Remember we are using a subconfig, not a path 
so use {parts:{0:head{color:"white"}}} to access an indice in an array 

// the mode is direct compiled code, not interpreted 
// we can write all or part with dot except array or all as arrays: 
//         parts[0].head.color is ok
//  but    parts.0.head.color is Nok 
//  are ok full string keys: 
// [   "parts"][0]["head"]["color"] is ok 
// [   "parts"]["0"]["head"]["color"] is  ok too

//  to change only a simple value in an array
//  stroke:{color[0]:10}
 
 


*/
function testUpdates() {
  console.log("----- test update(config,subconfig) ------");
  let config = copyConfig(configTest);
  let subConfig;
  // simple
  subConfig = { visible: false };
  patchConfig(config, subConfig);
  console.assert(config.visible == false, traceConfig(subConfig));
  subConfig = { position: { y: 30 } };
  patchConfig(config, subConfig);
  console.assert(config.position.y == 30, traceConfig(subConfig));
  // tests other unchanged
  console.assert(config.position.x == 0, traceConfig(subConfig));

  // composed
  subConfig = { stroke: { weight: 1 } };
  patchConfig(config, subConfig);
  console.assert(config.stroke.weight == 1, traceConfig(subConfig));
  // composed with indice in array
  // cannot design a litteral as {stroke:color[0]:200} us {0:...}
  subConfig = { stroke: { color: { 0: 200 } } };
  patchConfig(config, subConfig);
  console.assert(config.stroke.color[0] == 200, traceConfig(subConfig));
  console.assert(config.stroke.color[1] == 100, traceConfig(subConfig));
  console.assert(config.stroke.color[2] == 200, traceConfig(subConfig));

  console.log("--following test must rise a warning");
  subConfig = { stroke: { color: 10 } };
  patchConfig(config, subConfig);
  console.assert(config.stroke.color == 10, traceConfig(subConfig));

  console.log("--following test must rise a warning");
  subConfig = { stroke: { color: color("red") } };
  patchConfig(config, subConfig);
  // cannot compare two distinct returned objects by: config.stroke.color==color("red")
  // assuming it is a color, verify values
  console.assert(red(config.stroke.color) == 255, traceConfig(subConfig));

  console.log("----- test wrong update(config,subconfig) ------ ");
  config = copyConfig(configTest);
  console.log("--- typo errors ---");
  subConfig = { stroke: { Weight: 1 } };
  patchConfig(config, subConfig);
  console.assert(config.stroke.weight == 1, traceConfig(subConfig));
  subConfig = { position: { x: 20, Y: 30, z: 40 } };
  patchConfig(config, subConfig);
  console.assert(config.position.y == 30, traceConfig(subConfig));
  console.log("--- unknow key for update ---");
  subConfig = { fill:{active:false, color:"yellow"}}
  patchConfig(config, subConfig);
  console.log("-------------------------------")
}

function testExtend(){
    console.log("----- test extends(config,subconfig) ------");

}

function testCopy(){
    console.log("----- test copy(config)) ------");
    let bis= copyConfig(configTest);
    // verify serialisation-deserialisation 
    console.assert(JSON.stringify(bis)==JSON.stringify(configTest)," not same stringify ")
    // verify independancy of result 
    bis.stroke.weight = 1;
    console.assert(configTest.stroke.weight == 0.2," no independancy after copy")
}