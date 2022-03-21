function benchAccess(){
let config = {
    name: "myObject",    // to facilitate debug, give a name to objects
    visible: true,      // if false object is not drawn
    position: [0, 0, 0],// current location of object
    stroke: { active: true, color: "white", weight: 1 },
    fill: { active: false, color: [200,100,100] },
  };
 

 

 let resu 
 let tours = 100000
 console.log('--------- nb of run : '+tours+ ' ------------')
 var start = millis();
 for (i=1; i<tours;i++){
 resu = config.fill.color[2];
}
var elapsed = millis()-start;
console.log(elapsed+'ms with config.fill.color[2]; result is :'+ resu)
console.log('---------------------:')

var start = millis();
for (i=1; i<tours;i++){
 resu = config["fill"]["color"]["2"]
}
var elapsed = millis()-start;
console.log(elapsed+'ms with config["fill"]["color"]["2"]; result is :'+ resu)


// with getSet : 20.8 against 1.8 : so 10 times slower but controlled 
console.log('---------------------:')
 var start = millis();
 for (i=1; i<tours;i++){
    resu =  getSetData(config, "fill.color[2]",false)
 }
 var elapsed = millis()-start;
console.log(elapsed+' getSetData(config, "fill.color[2]",false)result is :'+ resu)




// with update : same as previous
console.log('---------------------:')
 var start = millis();
 for (i=1; i<tours;i++){
    patchConfig(config, {fill:{color:{2:10}}})
 }
 var elapsed = millis()-start;
console.log(elapsed+' patchConfig(config, {fill:{color:{2:10}}}) result is :'+ resu)
 console.log('---------------------')

}


