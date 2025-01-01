import { Gate, Point } from "@/app/gate/types"

   
export class GateCreator{
    private static offsetNOT=30
  
    private static Xoffset=40
    private static Yoffset=15
    private static counter=0
    static gateWidth=60
    static gateHeight=50
    static create(type:string="and",position:Point={x:100,y:100}):Gate{
        const id=`gate-${this.counter++}`
        const gate:Gate=type=="not"?{
            id:id,
            inputs:[
                {id:`input-${this.counter++}`,
                position:{x:position.x-this.offsetNOT,y:position.y},
                radius:9,
                type:"gate-input",
                value:null
                }
            ],
            output:{
                id:`output-${this.counter++}`,
                position:{x:position.x+this.offsetNOT*2,y:position.y},
                radius:9,
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
                {id:`input-${this.counter++}`,
                position:{x:position.x-this.Xoffset,y:position.y-this.Yoffset},
                radius:9,
                type:"gate-input",
                value:null
                },
                {id:`input-${this.counter++}`,
                position:{x:position.x-this.Xoffset,y:position.y+this.Yoffset},
                radius:9,
                type:"gate-input",
                value:null
                },
                
            ],
            output:{
                id:`output-${this.counter++}`,
                position:{x:position.x+this.offsetNOT*2,y:position.y},
                radius:9,
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
    static updatePosition(gate:Gate,newPosition:Point):Gate{
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
}