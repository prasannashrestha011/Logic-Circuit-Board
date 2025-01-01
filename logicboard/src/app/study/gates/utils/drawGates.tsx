import { Gate } from "@/app/gate/types";
import { DrawAndGate, DrawNanDGate, DrawNorGate, DrawNotGate, DrawORgate, DrawXorGate } from "@/app/gate/utils/drawGates";


export function DrawGatesNode(canvas:HTMLCanvasElement,gateNodes:Gate[]){
       const ctx=canvas.getContext('2d')
      if(!ctx) return 
    gateNodes.map(gate=>{
        
        //for input ports
        gate.inputs.map(inputPort=>{
            ctx.beginPath()
            ctx.fillStyle="red"
            ctx.arc(inputPort.position.x,inputPort.position.y,inputPort.radius,0,Math.PI*2)
            ctx.fill()
        })
        //@@ for output port 
        ctx.beginPath()
        ctx.fillStyle="red"
        ctx.arc(gate.output.position.x,gate.output.position.y,gate.output.radius,0,Math.PI*2)
        ctx.fill()

        //@draw based on the types
       if(gate.type=="and"){
            DrawAndGate(ctx,gate)
       }
       if(gate.type=="or"){
        DrawORgate(ctx,gate)
       }
       if(gate.type=="nor"){
        DrawNorGate(ctx,gate)
       }
       if(gate.type=="nand"){
        DrawNanDGate(ctx,gate)
       }
       if(gate.type=="x-or"){
        DrawXorGate(ctx,gate)
       }
       if(gate.type=="not"){
        DrawNotGate(ctx,gate)
       }
    })   
}