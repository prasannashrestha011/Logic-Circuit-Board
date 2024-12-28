
import { connection, Gate, Point, Port } from "./types"

 export const drawCanvas=(canvas:HTMLCanvasElement,portInputs:Port[],gates:Gate[],connections:connection[])=>{
   

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

        // ### for logic gate ###
      
        ctx.stroke();
        gates.forEach(gate=>{

            ctx.fillStyle = 'blue';
  
        
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(gate.position.x, gate.position.y - gate.height/2, gate.width, gate.height);
            ctx.fill();
          

          gate.inputs.forEach(port=>{
            ctx.beginPath()
            const {x,y}=port.position
            ctx.arc(x,y,port.radius,0,Math.PI*2)
            ctx.fillStyle="red" // ## will be changed on output
            ctx.fill()
           })
           ctx.beginPath()
           const {x:outPutX,y:outPutY}=gate.output.position
           ctx.arc(outPutX,outPutY,gate.output.radius,0,Math.PI*2)
           ctx.fillStyle=gate.output.value?"red":"black"
           ctx.fill()
        })

        //##for connections lines
        connections.forEach(conn=>{
            ctx.beginPath()
            ctx.strokeStyle="black"
            ctx.moveTo(conn.start.position.x,conn.start.position.y)
            ctx.lineTo(conn.end.position.x,conn.end.position.y)
            ctx.stroke()
        })
        
}
export const getCanvasPoints=(canvas:HTMLCanvasElement,clientX:number,clientY:number):Point=>{
 
    const rect=canvas.getBoundingClientRect()
    return{
      x:clientX-rect.left,
      y:clientY-rect.top
    }
  }