import { Gate, Port } from "./types";

export const portInputs:Port[]=[
    {id:'port-input-1',position:{x:20,y:60},radius:10,type:'input',value:false},
    {id:'port-input-2',position:{x:20,y:100},radius:10,type:'input',value:false},
    {id:'port-input-3',position:{x:20,y:140},radius:10,type:'input',value:false},
    {id:'port-input-4',position:{x:20,y:180},radius:10,type:'input',value:false}
]


export const Gates:Gate[]=[
    {
        id: 'Gate_1',
        position: { x: 150, y: 100 },
        width: 80,
        height: 60,
        inputs: [
          { id: 'gate1_input1', position: { x: 130, y: 80 }, type: 'gate-input', value: null, radius: 6 },
          { id: 'gate1_input2', position: { x: 130, y: 120 }, type: 'gate-input', value: null, radius: 6 }
        ],
        output: { id: 'gate1_output', position: { x: 250, y: 100 }, type: 'output', value: null, radius: 6 },
        type: 'and'
      },
      {
        id: 'Gate_2',
        position: { x: 350, y: 100 },
        width: 80,
        height: 60,
        inputs: [
          { id: 'gate2_input1', position: { x: 330, y: 80 }, type: 'gate-input', value: null, radius: 6 },
          { id: 'gate2_input2', position: { x: 330, y: 120 }, type: 'gate-input', value: null, radius: 6 }
        ],
        output: { id: 'gate2_output', position: { x: 450, y: 100 }, type: 'output', value: null, radius: 6 },
        type: 'or'
      }
     
]
// utils/calculatePositions.ts
export const adjustPositions = (width: number, height: number) => {
  // Adjust input ports - keep them on left side
  const adjustedPorts = [
    { id: 'port-input-1', position: { x: width * 0.05, y: height * 0.2 }, radius: 10, type: 'input', value: false },
    { id: 'port-input-2', position: { x: width * 0.05, y: height * 0.4 }, radius: 10, type: 'input', value: false },
    { id: 'port-input-3', position: { x: width * 0.05, y: height * 0.6 }, radius: 10, type: 'input', value: false },
    { id: 'port-input-4', position: { x: width * 0.05, y: height * 0.8 }, radius: 10, type: 'input', value: false }
  ]

  // Adjust gates - space them evenly
  const adjustedGates = [
    {
      id: 'Gate_1',
      position: { x: width * 0.3, y: height * 0.5 },
      width: 80,
      height: 60,
      inputs: [
        { id: 'gate1_input1', position: { x: width * 0.25, y: height * 0.4 }, type: 'gate-input', value: null, radius: 6 },
        { id: 'gate1_input2', position: { x: width * 0.25, y: height * 0.6 }, type: 'gate-input', value: null, radius: 6 }
      ],
      output: { id: 'gate1_output', position: { x: width * 0.35, y: height * 0.5 }, type: 'output', value: null, radius: 6 },
      type: 'and'
    },
    {
      id: 'Gate_2',
      position: { x: width * 0.6, y: height * 0.5 },
      width: 80,
      height: 60,
      inputs: [
        { id: 'gate2_input1', position: { x: width * 0.55, y: height * 0.4 }, type: 'gate-input', value: null, radius: 6 },
        { id: 'gate2_input2', position: { x: width * 0.55, y: height * 0.6 }, type: 'gate-input', value: null, radius: 6 }
      ],
      output: { id: 'gate2_output', position: { x: width * 0.65, y: height * 0.5 }, type: 'output', value: null, radius: 6 },
      type: 'or'
    }
  ]

  return { adjustedPorts, adjustedGates }
}