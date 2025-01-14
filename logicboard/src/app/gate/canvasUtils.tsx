
import { connection, Gate, Point, Port } from "./types"
import { DrawAndGate, DrawNanDGate, DrawNorGate, DrawNotGate, DrawORgate, DrawXorGate } from "./utils/drawGates"

 export const drawCanvas=(canvas:HTMLCanvasElement,portInputs:Port[],outputPorts:Port[],gates:Gate[],connections:connection[])=>{
   

        const ctx=canvas.getContext('2d')
        if(!ctx) return 
        ctx.clearRect(0,0,canvas.width,canvas.height)
      
        //### for input ports ###
        portInputs.forEach(port=>{
        
            ctx.beginPath()
            const {x,y}=port.position
            ctx.arc(x,y,port.radius,0,Math.PI*2)
        
            ctx.fillStyle=port.value?"orange":"black"
            ctx.fill()

        })

        //### for output ports ###
        outputPorts.forEach(port=>{
        
          const XOFFSET=30
          ctx.beginPath()
          const {x,y}=port.position
          ctx.arc(x,y,port.radius,0,Math.PI*2)
          ctx.fillStyle="red"
          ctx.fill()
          ctx.beginPath()
          ctx.fillStyle="white"
          ctx.arc(x,y,port.radius/4,0,Math.PI*2)
          ctx.fill()

          ctx.beginPath()
          ctx.fillStyle=port.value?"red":"black"
          ctx.arc(x+XOFFSET,y,port.radius,0,Math.PI*2)
          ctx.fill()

          ctx.beginPath()
          ctx.lineWidth=2
          ctx.moveTo(x+XOFFSET,y)
          ctx.lineTo(x+11,y)
          ctx.stroke()
      })
        // ### for logic gate ###
      
        ctx.stroke();
        gates.forEach(gate=>{
  
            if(gate.type=='and'){
             DrawAndGate(ctx,gate)
            }
          if(gate.type=="or"){
           
            DrawORgate(ctx,gate)
           
          }
          if(gate.type=="not"){
            DrawNotGate(ctx,gate)
          }
          if(gate.type=="nand"){
            DrawNanDGate(ctx,gate)
          }
          if(gate.type=="nor"){
            DrawNorGate(ctx,gate)
          }
          if(gate.type=="x-or"){
            DrawXorGate(ctx,gate)
          }
          gate.inputs.forEach(port=>{
            ctx.beginPath()
            const {x,y}=port.position
            ctx.arc(x,y,port.radius,0,Math.PI*2)
            ctx.fillStyle="red" 
            ctx.fill()

            ctx.beginPath()
            ctx.fillStyle="white"
            ctx.arc(x,y,port.radius/4,0,Math.PI*2)
            ctx.fill()
           })
           ctx.beginPath()
           const {x:outPutX,y:outPutY}=gate.output.position
           ctx.arc(outPutX,outPutY,gate.output.radius,0,Math.PI*2)
           ctx.fillStyle=gate.output.value?"red":"black"
           ctx.fill()


           ctx.beginPath()
           ctx.fillStyle="white"
           ctx.arc(outPutX,outPutY,gate.output.radius/4,0,Math.PI*2)
           ctx.fill()
        })

        //##for connections lines
        connections.forEach((conn) => {
          ctx.beginPath();
          ctx.strokeStyle = "black";
          ctx.setLineDash([8, 5]); // [dash length, gap length]
          ctx.lineWidth = 2; // Adjust thickness
          ctx.moveTo(conn.start.position.x, conn.start.position.y);
          ctx.lineTo(conn.end.position.x, conn.end.position.y);
          ctx.stroke();
          ctx.setLineDash([]); // Reset line dash for future drawings
      });
      
        
}
export const getCanvasPoints=(canvas:HTMLCanvasElement,clientX:number,clientY:number):Point=>{
 
    const rect=canvas.getBoundingClientRect()
    return{
      x:clientX-rect.left,
      y:clientY-rect.top
    }
  }