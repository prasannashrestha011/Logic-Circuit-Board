import { Res } from "../types";

export function calDeviceResolution():Res{
    const width=window.innerWidth  *0.98
    const height=window.innerHeight  * 0.89
    return {width,height}
}