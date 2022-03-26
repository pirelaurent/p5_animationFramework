/*--------------------------------------------------------------
 helper to see axis on the canvas  centered to current position 
 Default : 
    long: half width  
    step: a tick each 50 pix by default
*/
// global to help toggle in debug
var showAxes = false;

function utilAxis(long = null, step = 50, weight = 2) {
  if (!long) long = min(width,height)/2 - 30;  
  push();
  noFill();
  strokeWeight(weight);
  // test current angleMode to restore it at end
  var isRadian = sin(HALF_PI) == 1;
  angleMode(RADIANS);
  var colXplus = "crimson"; //red
  var colXmoins = "red";
  var colYplus = "green"; //green
  var colYmoins = "lime";
  var colZplus = "blue"; // blue
  var colZmoins = "blue";
  ambientLight(100); // white light
  var hCone = long / 20;
  // X axis
  stroke(colXplus);
  line(0, 0, 0, long, 0, 0);
  stroke(colXmoins);
  line(0, 0, 0, -long, 0, 0);
  push();
  stroke(colXplus);
  ambientMaterial(colXmoins);
  translate(long + hCone / 2, 0, 0);
  rotateZ(-PI / 2);
  cone(hCone / 2, hCone, 10);
  pop();
  // Y axis
  stroke(colYplus);
  line(0, 0, 0, 0, long, 0);
  push();
  stroke(colYplus);
  ambientMaterial(colYmoins);
  translate(0, long + hCone / 2, 0);
  cone(hCone / 2, hCone, 10);
  pop();
  stroke(colYmoins);
  line(0, 0, 0, 0, -long, 0);

  // Z axis
  stroke(colZplus);
  line(0, 0, 0, 0, 0, long);
  push();
  stroke(colZplus);
  ambientMaterial(colZmoins);
  translate(0, 0, long + hCone / 2);
  rotateX(PI / 2);
  cone(hCone / 2, hCone, 10);
  pop();
  stroke(colZmoins);
  line(0, 0, 0, 0, 0, -long);
  // planes
  var c = color("white");
  c.setAlpha(180);
  fill(c);
  noStroke();

  var pos = 0;
  var tour = 0;
  while (pos <= long) {
    let rond = min(long / 100, 10);
    push();
    if (tour % 10 == 0) {
      rond = 2 * rond;
    }
    ambientLight(100); // white light
    noStroke();
    fill("white");
    push();
    ambientMaterial(colXplus);
    translate(pos, 0, 0);
    sphere(rond);
    translate(-2 * pos, 0, 0);
    sphere(rond);
    pop();
    push();
    ambientMaterial(colYplus);
    translate(0, 0, 0);
    translate(0, pos, 0);
    sphere(rond);
    translate(0, -2 * pos, 0);
    sphere(rond);
    pop();
    push();
    ambientMaterial(colZplus);
    translate(0, 0, pos);
    sphere(rond);
    translate(0, 0, -2 * pos);
    sphere(rond);
    pop();
    pop();
    pos = pos + step;
    tour += 1;
  }
  pop();
  // angleMode is not restored by push/pop
  if (!isRadian) angleMode(DEGREES);
}
