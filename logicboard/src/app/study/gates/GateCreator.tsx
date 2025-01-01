import { Gate, Point } from "@/app/gate/types"


export class GateCreator{
    private static counter=0
    static gateWidth=60
    static gateHeight=50
    static create(type:string="and",position:Point={x:100,y:100}):Gate{
        const id=`gate-${this.counter++}`
        const gate:Gate=type=="not"?{
            id:id,
            inputs:[
                {id:`input-${this.counter++}`,
                position:{x:position.x-30,y:position.y},
                radius:9,
                type:"gate-input",
                value:null
                }
            ],
            output:{
                id:`output-${this.counter++}`,
                position:{x:position.x+60,y:position.y},
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
                position:{x:position.x-40,y:position.y-15},
                radius:9,
                type:"gate-input",
                value:null
                },
                {id:`input-${this.counter++}`,
                position:{x:position.x-40,y:position.y+15},
                radius:9,
                type:"gate-input",
                value:null
                },
                
            ],
            output:{
                id:`output-${this.counter++}`,
                position:{x:position.x+60,y:position.y},
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
}