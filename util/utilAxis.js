/*--------------------------------------------------------------
 helper to see axes on the canvas . 
 Default : long: 500 a tick each 10th 
 long is a branch
*/
// global to help toggle in debug 
var showAxes = false;

function axes(long = 500, weight = 2, version = 0) {
    push();
    noFill();
    strokeWeight(weight);
    // test current angleMode to restore it at end 
    var isRadian = (sin(HALF_PI)==1);
    angleMode(RADIANS);
    if (version == 0) {
        var colXplus = "crimson"; //red
        var colXmoins = "red";
        var colYplus = "green" //green
        var colYmoins = "lime";
        var colZplus = "blue"; // blue
        var colZmoins = "blue";
    };
    ambientLight(100); // white light
    var hCone = long / 20;
    // X axis
    stroke(colXplus);
    line(0, 0, 0, long, 0, 0);
    stroke(colXmoins);
    line(0, 0, 0, -long, 0, 0);
    push(); stroke(colXplus); ambientMaterial(colXmoins); translate(long + hCone / 2, 0, 0); rotateZ(-PI / 2); cone(hCone / 2, hCone, 10); pop();
    // Y axis
    stroke(colYplus);
    line(0, 0, 0, 0, long, 0);
    push(); stroke(colYplus); ambientMaterial(colYmoins); translate(0, long + hCone / 2, 0); cone(hCone / 2, hCone, 10); pop();
    stroke(colYmoins);
    line(0, 0, 0, 0, -long, 0);

    // Z axis
    stroke(colZplus);
    line(0, 0, 0, 0, 0, long);
    push(); stroke(colZplus); ambientMaterial(colZmoins); translate(0, 0, long + hCone / 2); rotateX(PI / 2); cone(hCone / 2, hCone, 10); pop();
    stroke(colZmoins);
    line(0, 0, 0, 0, 0, -long);
    // planes
    var c= color("white");
    c.setAlpha(180);
    fill(c);noStroke();


    // divide in 50 parts : for 500 a stick each 10 px a big each 200 
    var parts = 10;
    // 2 cotés 
    var step = long / parts;

    for (var i = -parts ; i <= parts ; i++) {
        var pos = i * step;
        let rond = min(long / 100,10); 
        push();
        if ((i % 10) == 0) { rond = 2 * rond };
        ambientLight(100); // white light
        noStroke();
        fill('white');
        ambientMaterial(colXplus);
        translate(pos, 0, 0);
        sphere(rond);

        ambientMaterial(colYplus);
        translate(-pos, 0, 0);
        translate(0, pos, 0);
        sphere(rond);

        ambientMaterial(colZplus);
        translate(0, -pos, pos);
        sphere(rond);
        pop();
    }
    pop();
    // angleMode is not restored by push/pop
    if (! isRadian) angleMode(DEGREES);
}
