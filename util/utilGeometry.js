
/*
 rectify a Geometry 
 useful for .obj as P5 uses y down and others use y up : 
  multiply by 1,-1,1
  can also reverse x and y : -1,-1,1 
  To scale once after load  : 2,2,2 
  ( obj rectified can be saved with )
*/
function multiplyGeometry(someGeo, aVector){
 for (let v of someGeo.vertices){
     v.mult(aVector)
 }
}

/*
 p5 inverse y when reading vt 0, 0.2  , it creates uvs 0,0.8
 This function rectify the right values to display texture 
 Do it in setup, once .obj is fully loaded
 ( Can save result with saveGraphicsOnFileObj)
*/
function rectifyObjUvsForP5AfterLoad(forme) {
    for (var i = 0; i < forme.uvs.length; i++) {
      forme.uvs[i][1] = 1 - forme.uvs[i][1];
    }
  }
/*
 help to center a .obj after loading 
 ( Can save result with saveGraphicsOnFileObj)
*/

function moveObj(anObj,v_xyz){
    for (var v of anObj.vertices) {
        v.add(v_xyz);
    }
}

/*
    copy a loaded model in a new one
    change id optional : default reuse original id + 'modified' + ms
    return a model 
*/
function objCopy(ap5Graphics, gid = null) {
    let resu = new p5.Geometry(ap5Graphics.detailX, ap5Graphics.detailY);
    // si on a fournit un gid spécifique on le prend 
    if (gid != null)
        resu.gid = gid;
    // sinon on dérive de l'original
    else
        resu.gid = ap5Graphics.gid + ' modified at:' + nf(millis(), 4, 0);
    // copy vertices that are vectors 
    resu.vertices = [];
    for (var vertex of ap5Graphics.vertices){
        var newVertex = createVector(vertex.x,vertex.y,vertex.z);
        resu.vertices.push(newVertex);
    }
    // copy faces . internal : copy indices for each triangle 
    resu.faces = [];
    for (face of ap5Graphics.faces) {
        resu.faces.push([face[0], face[1], face[2]]);
    }

    // copy normals 
    resu.vertexNormals = ap5Graphics.vertexNormals.map(aNormal => createVector(aNormal));
    // copy uvs 
    resu.uvs = ap5Graphics.uvs.map(uvs => uvs.map(coord => coord));
    return resu;
}
/*
    create a file at the .obj format (for vertex and faces) from an internal model
    used to save modified obj from an original after transformation 
*/

function saveGraphicsOnFileObj(ap5Graphics, name) {

    if (name.includes('.obj') == false) name = name + '.obj';
    var writer = createWriter(name);
    writer.write('# gid:' + ap5Graphics.gid + ' \n');
    console.log('saveGraphicsOnFileObj: saving '+name);

    writer.write('#----------------- vertices :'+ap5Graphics.vertices.length+' --------------------\n')
    for (var v of ap5Graphics.vertices) {
        writer.write('v ' + nf(v.x, 1, 4) + ' ' + nf(v.y, 1, 4) + ' ' + nf(v.z, 1, 4) + '\n');
    }

   writer.write('#----------------- uvs :'+ap5Graphics.uvs.length+'--------------------\n')
   for (var uvs of ap5Graphics.uvs){
       writer.write("vt "+nf(uvs[0],1,5)+' '+nf(uvs[1],1,5)+'\n');
   }
    writer.write('#------------------------ faces:'+ap5Graphics.faces.length+' ---------------\n')
    for (var f of ap5Graphics.faces) {
        // in obj index of vertices begins to 1 
        // if texture set corresponding indice vt
        var s = 'f '+(f[0] + 1)+'/'+(f[0] + 1)+' ';
        s+=(f[1] + 1)+'/'+(f[1] + 1)+' ';
        s+=(f[2] + 1)+'/'+(f[2] + 1);
        writer.write(s+ '\n');
    }
    writer.close();
    alert(name + ' will be saved with navigator');
}

/*
 if you change dynamically by code a loaded model, an old version stays in cache and you can't see the result. 
 You must change the .gid property in order to inform webgl this is a new thing to draw. 
 I tried to use canvas._freeBuffers(mod.gid) to reduce memory, 
 but had trouble with an 'invalid_operation drawArrays: no buffer is bound to enable attribute' 
 So don't make a heavy use  of dynamic evolution of a graphics shape 
 by changing points'values by code otherwise you can hang in memory. I use it a bit 

 Just change the gid by adding a dot at each new version.
 */
function refreshModel(mod){
    mod.gid+='.'
}
