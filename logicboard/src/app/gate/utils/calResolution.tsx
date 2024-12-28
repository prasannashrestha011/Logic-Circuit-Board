import { Res } from "../types";

export function calDeviceResolution():Res{
    const width=window.innerWidth  
    const height=window.innerHeight  
    return {width,height}
}