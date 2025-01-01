import { Gate } from "@/app/gate/types";

export function DrawAndGate(ctx:CanvasRenderingContext2D,gate:Gate):void{
    console.log("gate position",gate)
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
   // Set the fill style
ctx.fillStyle = "blue";

// Begin path for the AND gate
ctx.beginPath();
ctx.moveTo(gate.position.x + 2, gate.position.y - 18);
ctx.lineTo(gate.position.x + 2, gate.position.y + 17.3);
ctx.arc(gate.position.x + 17, gate.position.y, 17, Math.PI / 2, (3 * Math.PI) / 2, true);
ctx.closePath();
ctx.fill();

//for end line
ctx.beginPath()
ctx.moveTo(gate.position.x+34,gate.position.y)
ctx.lineTo(gate.output.position.x,gate.output.position.y)
ctx.stroke()

}