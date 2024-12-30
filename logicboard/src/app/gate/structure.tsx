import { Gate, Port } from "./types";

export const portInputs:Port[]=[
    {id:'port-input-1',position:{x:20,y:60},radius:10,type:'input',value:false},
    {id:'port-input-2',position:{x:20,y:100},radius:10,type:'input',value:false},
    {id:'port-input-3',position:{x:20,y:140},radius:10,type:'input',value:false},
    {id:'port-input-4',position:{x:20,y:180},radius:10,type:'input',value:false},

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
export const adjustPositions = (width: number, height: number, numRows: number = 3, numColumns: number = 4) => {

 const INPUT_RADIUS = 9;
 const GAP = height * 0.11;  // Gap between ports (adjust this value as needed)


 const adjustedPorts = Array.from({ length: 8 }, (_, index) => {
   // Calculate the Y position of each port with equal gaps
   const portPosition = {
     x: width * 0.03,  // Fixed X position for all input ports (adjust as needed)
     y: height * 0.03 + (index * GAP),  // Equal vertical spacing between ports
   };

   return {
     id: `port-input-${index + 1}`,
     position: portPosition,
     radius: INPUT_RADIUS,
     type: 'input',
     value: false
   };
 });

 const adjustedOutPutPorts=Array.from({length:6},(_,index)=>{
  const portPosition = {
    x: width * 0.98,  // Fixed X position for all input ports (adjust as needed)
    y: height * 0.20 + (index * GAP),  // Equal vertical spacing between ports
  };
  return {
    id: `port-output-${index + 1}`,
     position: portPosition,
     radius: INPUT_RADIUS,
     type: 'final-output',
     value: null
  }
 })

  const INPUT_OFFSET_X = -30;
  const INPUT1_OFFSET_Y = -15;
  const INPUT2_OFFSET_Y = 15;
  const OUTPUT_OFFSET_X = 54;


  const gateTypes = ['and', 'or', 'not']; // Define one type for each row

  const startX = width * 0.16;  // Starting X position
  const startY = height * 0.1; // Starting Y position
  const spacingX = (width * 0.6) / (numColumns - 1); // Horizontal spacing
  const spacingY = height * 0.19; // Vertical spacing

  // Generate gates and arrange them in a grid layout with same type for each row
  const adjustedGates = Array.from({ length: numRows * numColumns }, (_, index) => {
    const row = Math.floor(index / numColumns);  // Determine the row of the gate
    const column = index % numColumns;  // Determine the column of the gate

    const gatePosition = {
      x: startX + (spacingX * column),  // Horizontal position based on column
      y: startY + (spacingY * row)      // Vertical position based on row
    };

    // Each row will have the same gate type
    const gateType = gateTypes[row];

    // Adjust the number of inputs for the NOT gate
    const inputs = gateType === 'not' ? [
      {
        id: `gate${index + 1}_input1`,
        position: {
          x: gatePosition.x +INPUT_OFFSET_X, // Centered horizontally
          y: gatePosition.y +INPUT1_OFFSET_Y+15 // Centered vertically
        },
        type: 'gate-input',
        value: null,
        radius: 6
      }
    ] : [
      {
        id: `gate${index + 1}_input1`,
        position: {
          x: gatePosition.x + INPUT_OFFSET_X,
          y: gatePosition.y + INPUT1_OFFSET_Y
        },
        type: 'gate-input',
        value: null,
        radius: 6
      },
      {
        id: `gate${index + 1}_input2`,
        position: {
          x: gatePosition.x + INPUT_OFFSET_X,
          y: gatePosition.y + INPUT2_OFFSET_Y
        },
        type: 'gate-input',
        value: null,
        radius: 6
      }
    ];

    return {
      id: `Gate_${index + 1}`,
      position: gatePosition,
      width: 80,
      height: 60,
      inputs: inputs,
      output: {
        id: `gate${index + 1}_output`,
        position: {
          x: gatePosition.x + OUTPUT_OFFSET_X,
          y: gatePosition.y
        },
        type: 'output',
        value: null,
        radius: 7.5
      },
      type: gateType  // Assign the same gate type for each row
    };
  });

  return { adjustedPorts, adjustedGates,adjustedOutPutPorts };
};




