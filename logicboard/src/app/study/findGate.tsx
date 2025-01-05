import { Gate, Point, Port } from "../gate/types";
import { calDistance } from "../gate/utils/calDistance";

export  const isPointInGate = (point: Point, gate: Gate): boolean => {
        const { position, width, height } = gate;
        
        // Calculate gate boundaries
        const left = position.x - width/2;
        const right = position.x + width/2;
        const top = position.y - height/2;
        const bottom = position.y + height/2;
        
        // Check if point is within boundaries
        return (
            point.x >= left &&
            point.x <= right &&
            point.y >= top &&
            point.y <= bottom
        );
 };

 //@@ if user is dragging the port outer area execept the port  
 export const isPointInPortNode=(point:Point,port:Port):boolean=>{
    const {position,width,height}=port
    if(!width || !height) return false
    const left = position.x - width/2;
    const right = position.x + width/2;
    const top = position.y - height/2;
    const bottom = position.y + height/2;

    const isInsideTheRectangle=point.x >= left &&
    point.x <= right &&
    point.y >= top &&
    point.y <= bottom;

    const portDistance=calDistance(port,point)
    const isInPortDistance=portDistance<=port.radius;

    return isInsideTheRectangle && !isInPortDistance

 }