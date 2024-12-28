import {  Point, Port } from "@/interfaces/interface";

export  function getDistance(portPosition:Port,touchedPoint:Point):number{
    const distance = Math.sqrt(
        Math.pow(portPosition.position.x - touchedPoint.x, 2) + Math.pow(portPosition.position.y - touchedPoint.y, 2)
    );
    return distance;
}