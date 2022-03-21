/*
 rectify a Geometry 
 useful for .obj as P5 uses y down and others use y up : multiply by 1,-1,1
  can also reverse x and y : -1,-1,1 
 useful to scale once : 2,2,2 

*/
function multiplyGeometry(someGeo, aVector){
 for (let v of someGeo.vertices){
     v.mult(aVector)
 }
}