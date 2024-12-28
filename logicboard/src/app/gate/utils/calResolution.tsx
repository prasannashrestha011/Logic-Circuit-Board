import { Res } from "../types";

export function calDeviceResolution():Res{
    const width=window.innerWidth * 0.9 
    const height=window.innerHeight * 0.9 
    return {width,height}
}