import { Gate, Point } from "@/app/gate/types";

class GateFactory {
    private static counter = 0;

    static create(type: string = 'AND', position: Point = { x: 100, y: 100 }): Gate {
        const id = `gate-${++this.counter}`;
        
        return {
            id,
            type,
            position,
            width: 60,
            height: 40,
            inputs: [
                { id: `${id}-in1`, type: 'input', value: null, radius: 5, 
                position: { x: position.x-40, y: position.y-15 } },

                { id: `${id}-in2`, type: 'input', value: null, radius: 5,
                 position: { x: position.x-40, y: position.y+15 } }
            ],
            output: { id: `${id}-out`, type: 'output', value: null, radius: 5,
             position: { x: position.x+60, y: position.y } }
        };
    }
}
export default GateFactory