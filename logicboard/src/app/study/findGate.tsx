import { Gate, Point } from "../gate/types";

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