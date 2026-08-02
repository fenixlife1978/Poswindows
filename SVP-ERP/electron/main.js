const {
app,
BrowserWindow
}=require("electron");

const path=require("path");



function crearVentana(){


const ventana=
new BrowserWindow({

width:1400,

height:850,

minWidth:1100,

minHeight:700,


webPreferences:{

nodeIntegration:false,

contextIsolation:true,

preload: path.join(__dirname, "preload.js")

}


});



ventana.loadFile(

path.join(
__dirname,
"../index.html"
)

);



}



app.whenReady()
.then(()=>{


crearVentana();



app.on(
"activate",
()=>{

if(
BrowserWindow
.getAllWindows()
.length===0
)

crearVentana();


});


});




app.on(
"window-all-closed",
()=>{


if(
process.platform!=="darwin"
)

app.quit();



});