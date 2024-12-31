import { Res } from "../types";

export function calDeviceResolution():Res{
    const width=window.innerWidth 
    const height=window.innerHeight *0.94
    return {width,height}
}