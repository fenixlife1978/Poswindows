const {
contextBridge
}=require("electron");



contextBridge.exposeInMainWorld(

"SVP",

{


version:"1.0.0"


}

);