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
export const adjustPositions = (width: number, height: number, numColumns: number = 4) => {
  const INPUT_RADIUS = 9;
  const GAP = height * 0.11;

  const adjustedPorts = Array.from({ length: 8 }, (_, index) => ({
    id: `port-input-${index + 1}`,
    position: {
      x: width * 0.03,
      y: height * 0.03 + (index * GAP),
    },
    radius: INPUT_RADIUS,
    type: 'input',
    value: false
  }));

  const adjustedOutPutPorts = Array.from({ length: 6 }, (_, index) => ({
    id: `port-output-${index + 1}`,
    position: {
      x: width * 0.95,
      y: height * 0.20 + (index * GAP),
    },
    radius: INPUT_RADIUS,
    type: 'final-output',
    value: null
  }));

  const INPUT_OFFSET_X = -30;
  const INPUT1_OFFSET_Y = -15;
  const INPUT2_OFFSET_Y = 15;
  const OUTPUT_OFFSET_X = 54;

  // Define gates for each row
  const gateRows = [
    ['and', 'and', 'nand', 'nand'],
    ['or', 'or', 'nor', 'nor'],
    ['x-or', 'x-or','not', 'not']
  ];

  const startX = width * 0.16;
  const startY = height * 0.1;
  const spacingX = (width * 0.6) / (numColumns - 1);
  const spacingY = height * 0.25;

  const adjustedGates:Gate[] = [];

  gateRows.forEach((row, rowIndex) => {
    row.forEach((gateType, colIndex) => {
      const index = rowIndex * numColumns + colIndex;
      
      const gatePosition = {
        x: startX + (spacingX * colIndex),
        y: startY + (spacingY * rowIndex)
      };

      const gatePortRadius = 8;
      const inputs = gateType === 'not' ? [
        {
          id: `gate${index + 1}_input1`,
          position: {
            x: gatePosition.x + INPUT_OFFSET_X,
            y: gatePosition.y + INPUT1_OFFSET_Y + 15
          },
          type: 'gate-input',
          value: null,
          radius: gatePortRadius
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
          radius: gatePortRadius
        },
        {
          id: `gate${index + 1}_input2`,
          position: {
            x: gatePosition.x + INPUT_OFFSET_X,
            y: gatePosition.y + INPUT2_OFFSET_Y
          },
          type: 'gate-input',
          value: null,
          radius: gatePortRadius
        }
      ];

      adjustedGates.push({
        id: `Gate_${index + 1}`,
        position: gatePosition,
        width: 80,
        height: 60,
        inputs,
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
        type: gateType
      });
    });
  });

  return { adjustedPorts, adjustedGates, adjustedOutPutPorts };
};



