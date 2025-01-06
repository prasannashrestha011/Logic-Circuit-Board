import { connection, Gate, Point, Port } from "@/app/gate/types"

   
export class GateCreator{
    private static offsetNOT=30
  
    private static Xoffset=40
    private static Yoffset=15
    private static gateCounter=0
    private static portCounter=0
    private static portRadius=9
    static gateWidth=60
    static gateHeight=50
    static connections:connection[]=[]
    static createGate(type:string="and",position:Point={x:100,y:100}):Gate{
        const id=`gate-${this.gateCounter++}`
        const gate:Gate=type=="not"?{
            id:id,
            inputs:[
                {id:`input-${this.gateCounter++}`,
                position:{x:position.x-this.offsetNOT,y:position.y},
                radius:this.portRadius,
                type:"gate-input",
                value:null
                }
            ],
            output:{
                id:`output-${this.gateCounter++}`,
                position:{x:position.x+this.offsetNOT*2,y:position.y},
                radius:this.portRadius,
                type:"gate-output",
                value:null
            },
            position:position,
            type:type,
            width:this.gateWidth,
            height:this.gateHeight,
        }:{
            id:id,
            inputs:[
                {id:`input-${this.gateCounter++}`,
                position:{x:position.x-this.Xoffset,y:position.y-this.Yoffset},
                radius:this.portRadius,
                type:"gate-input",
                value:null
                },
                {id:`input-${this.gateCounter++}`,
                position:{x:position.x-this.Xoffset,y:position.y+this.Yoffset},
                radius:this.portRadius,
                type:"gate-input",
                value:null
                },
                
            ],
            output:{
                id:`output-${this.gateCounter++}`,
                position:{x:position.x+this.offsetNOT*2,y:position.y},
                radius:this.portRadius,
                type:"gate-output",
                value:null
            },
            position:position,
            type:type,
            width:this.gateWidth,
            height:this.gateHeight,
        }

        return gate
    }
    static createPort(type:string="inputPort",position:Point={x:20,y:80}):Port{
        const id=`${type}-port-${this.portCounter++}`
        const port:Port={
            id,
            position,
            radius:this.portRadius,
            type,
            width:40,
            height:60,
            value:false
        }
        return port
    }


    static updateGatePosition(gate:Gate,newPosition:Point):Gate{
        const updatedInputPort=gate.inputs.map((input,idx)=>({
            ...input,
            position:{
                x:gate.type==='not'?newPosition.x-this.offsetNOT:newPosition.x-this.Xoffset,
                y:gate.type==='not'?newPosition.y:
                (
                    idx==0?newPosition.y-this.Yoffset:newPosition.y+this.Yoffset
                )
            },
           
        }))
       const updatedOutput={
        ...gate.output,
        position:{
            x:newPosition.x+this.offsetNOT*2,
            y:newPosition.y
        },
       };

       const updatedGate:Gate={
        ...gate,
        position:newPosition,
        inputs:updatedInputPort,
        output:updatedOutput
       }
       return updatedGate
    }
    static updatePortPosition(port:Port,newPosition:Point):Port{
        const updatePort:Port={...port,position:newPosition}
        return updatePort
    }
}