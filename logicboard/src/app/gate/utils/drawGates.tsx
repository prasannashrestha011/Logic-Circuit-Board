import { Gate } from "../types";

export function DrawAndGate(ctx:CanvasRenderingContext2D,gate:Gate):void{
    ctx.fillStyle = 'blue'; 
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gate.inputs[0].position.x,gate.inputs[0].position.y)
    ctx.lineTo(gate.position.x,gate.position.y-15)

    ctx.moveTo(gate.inputs[1].position.x,gate.inputs[1].position.y)
    ctx.lineTo(gate.position.x,gate.position.y+15)

   //vertical line
    ctx.moveTo(gate.position.x, gate.position.y - 15); 
    ctx.lineTo(gate.position.x, gate.position.y + 15);


    ctx.stroke()
   


    ctx.beginPath();
    ctx.arc(gate.position.x , gate.position.y, 18, 3 * Math.PI / 2, Math.PI / 2);

    ctx.fillStyle = 'blue';  // Set fill color for the circle
    ctx.fill(); // Fill the circle
    ctx.stroke();
    ctx.fill();
}