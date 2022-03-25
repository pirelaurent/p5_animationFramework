/*
 helper to p5 with keyboard 
 Active your debug console ( cmd option i ) or through nav menu 
 Add kbHelp() in your draw loop 
 Use keyboard to add/retract/see/change parameters and options  
*/


//-------------- some global to use with keyboard---------  
var kb ={
    showAxes: false,
    showGrid: false,
   }

   // to be added in the draw loop 
   function kbHelp(){
    if(!kb.infoDone) {
        console.log(' type "h" to see helper functions with keyboard');
        kb.infoDone = true;
    }
    if(kb.showAxes) utilAxis();
    if(kb.showGrid) debugMode(GRID, 800,80); else noDebugMode()
   }

   function keyTyped() {
       console.log("*** keyTyped:" + key);
       switch (key) {
           case "a": kb.showAxes = !kb.showAxes; break;
           case "g": kb.showGrid = !kb.showGrid;break;
   
   
           // help 
           case "h" :
               var help =`
               **** Keyboard option **** 
               a: show axes 
               g: show grid 
               `
           console.log( help);
       }
   }