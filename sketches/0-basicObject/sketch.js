///<reference path="../../p5/intellisense/p5.global-mode.d.ts" />

"use strict";
var can;
var obj_1;
var obj_2;
var obj_3;



function setup(){
 can = createCanvas(800,800,WEBGL)
 obj_1 = new GraphicObject();
 // constructor with patch to apply to default config
 obj_2 = new GraphicObject({
    position: [-200, 0, 0], // current location of object to draw it
    rotation: [30, 45, 0], // in degrees
    fill: { color: 'blue' },
 })

 obj_3 = new GraphicObject( {position: [0,-200,0]});
 // apply some change by code ( or make a subclass )
 obj_3.drawModel = () => sphere(50)
}


function draw(){
    orbitControl(1,1,1);
    background(80);
    kbHelp();
    obj_1.draw();
    obj_2.draw();
    obj_3.draw();
}



