import { Point, Port } from "../types";

export function calDistance(targetedPort:Port,touchedPoint:Point):number{
    const distance=Math.sqrt(
        Math.pow(targetedPort.position.x-touchedPoint.x,2) + 
        Math.pow(targetedPort.position.y-touchedPoint.y,2)   
    )

    return distance
}