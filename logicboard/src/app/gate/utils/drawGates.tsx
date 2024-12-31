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
export function DrawORgate(ctx:CanvasRenderingContext2D,gate:Gate):void{
    ctx.beginPath()
    ctx.fillStyle="blue"
    ctx.moveTo(gate.inputs[0].position.x,gate.inputs[0].position.y)
    ctx.lineTo(gate.position.x,gate.position.y-15)
    ctx.moveTo(gate.inputs[1].position.x,gate.inputs[1].position.y)
    ctx.lineTo(gate.position.x,gate.position.y+15)

    //vertical line
    ctx.moveTo(gate.position.x,gate.position.y-15)
    ctx.lineTo(gate.position.x,gate.position.y+15)
    ctx.stroke()
    
    ctx.beginPath();
    ctx.fillStyle="blue"
    ctx.moveTo(gate.position.x+4,gate.position.y-15)
    ctx.lineTo(gate.position.x+34,gate.position.y)
    ctx.lineTo(gate.position.x+4,gate.position.y+15)
    ctx.fill()
    ctx.stroke(); // Draws the outline
    
    //for end line
    ctx.beginPath()
    ctx.moveTo(gate.position.x+34,gate.position.y)
    ctx.lineTo(gate.output.position.x,gate.output.position.y)
    ctx.stroke()
    ctx.fill()
}
export function DrawNotGate(ctx:CanvasRenderingContext2D,gate:Gate):void{

    ctx.lineWidth = 2;
    ctx.beginPath();
 
    ctx.moveTo(gate.inputs[0].position.x,gate.inputs[0].position.y)
    ctx.lineTo(gate.position.x,gate.position.y)
    ctx.stroke()

    ctx.beginPath();
    ctx.fillStyle="blue"
    ctx.moveTo(gate.position.x+4,gate.position.y-15)
    ctx.lineTo(gate.position.x+34,gate.position.y)
    ctx.lineTo(gate.position.x+4,gate.position.y+15)
    ctx.fill()
    ctx.stroke(); 

    DrawNod(ctx,gate)

    //for end line 
    ctx.beginPath()
    ctx.moveTo(gate.position.x+34,gate.position.y)
    ctx.lineTo(gate.output.position.x,gate.output.position.y)
    ctx.stroke()
}

export function DrawNanDGate(ctx:CanvasRenderingContext2D,gate:Gate):void{
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

        DrawNod(ctx,gate)
        //for end line
        ctx.beginPath()
        ctx.moveTo(gate.position.x+34,gate.position.y)
        ctx.lineTo(gate.output.position.x,gate.output.position.y)
        ctx.stroke()
}
export function DrawNorGate(ctx:CanvasRenderingContext2D,gate:Gate):void{
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gate.inputs[0].position.x,gate.inputs[0].position.y)
    ctx.lineTo(gate.position.x,gate.position.y-15)
    ctx.stroke()


    ctx.beginPath()
    ctx.moveTo(gate.inputs[1].position.x,gate.inputs[1].position.y)
    ctx.lineTo(gate.position.x,gate.position.y+15)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(gate.position.x,gate.position.y-15)
    ctx.lineTo(gate.position.x,gate.position.y+15)
    ctx.stroke()
    ctx.beginPath();
    ctx.fillStyle="blue"
    ctx.moveTo(gate.position.x+4,gate.position.y-15)
    ctx.lineTo(gate.position.x+34,gate.position.y)
    ctx.lineTo(gate.position.x+4,gate.position.y+15)
    ctx.fill()
    ctx.stroke(); 

    DrawNod(ctx,gate)

    //for end line 
    ctx.beginPath()
    ctx.moveTo(gate.position.x+34,gate.position.y)
    ctx.lineTo(gate.output.position.x,gate.output.position.y)
    ctx.stroke()
}

export function DrawXorGate(ctx:CanvasRenderingContext2D,gate:Gate):void{
  
        const intersectingLength=5

        ctx.lineWidth = 2;
        //for input port lines
        ctx.beginPath();
        ctx.moveTo(gate.inputs[0].position.x,gate.inputs[0].position.y)
        ctx.lineTo(gate.position.x-intersectingLength,gate.position.y-15)
        ctx.stroke()
    
    
        ctx.beginPath()
        ctx.moveTo(gate.inputs[1].position.x,gate.inputs[1].position.y)
        ctx.lineTo(gate.position.x-intersectingLength,gate.position.y+15)
        ctx.stroke()
    
        ctx.beginPath()
        ctx.moveTo(gate.position.x-intersectingLength,gate.position.y-15)
        ctx.lineTo(gate.position.x-intersectingLength,gate.position.y+15)
        ctx.stroke()


        //for second line
        ctx.beginPath()
        ctx.moveTo(gate.position.x,gate.position.y-15)
        ctx.lineTo(gate.position.x,gate.position.y+15)
        ctx.stroke()

        ctx.beginPath();
        ctx.fillStyle="blue"
        ctx.moveTo(gate.position.x+4,gate.position.y-15)
        ctx.lineTo(gate.position.x+34,gate.position.y)
        ctx.lineTo(gate.position.x+4,gate.position.y+15)
        ctx.fill()
        ctx.stroke(); 
    
        DrawNod(ctx,gate)
    
        //for end line 
        ctx.beginPath()
        ctx.moveTo(gate.position.x+34,gate.position.y)
        ctx.lineTo(gate.output.position.x,gate.output.position.y)
        ctx.stroke()
    
}
function DrawNod(ctx:CanvasRenderingContext2D,gate:Gate){
    ctx.beginPath()
    ctx.fillStyle="black"
    ctx.arc(gate.output.position.x-17,gate.output.position.y,4,0,Math.PI*2)
    ctx.fill()
}