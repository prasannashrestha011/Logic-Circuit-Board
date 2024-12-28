import { Gate, Port } from "../types";

  export const computeGateOutput = (gateType:string, inputs:Port[]) => {
      const inputValues = inputs.map(port => port.value);
      
      switch (gateType) {
        case 'and':
          return inputValues.every(Boolean);
        case 'or':
         if(inputValues[0]!=null && inputValues[1]!=null){
          console.log("or gate inputs",inputValues)
          return inputValues[0] != null && inputValues[1] != null && (inputValues[0] || inputValues[1]);
         }

        default:
          return null;
      }
    };
 export  const updateGates = (gates:Gate[], targetedPort:Port, selectedPort:Port) => {
       return gates.map(gate => {
         // Check if gate has the targeted port before mapping
         const hasTargetPort = gate.inputs.some(port => port.id === targetedPort.id);
         if (!hasTargetPort) return gate;
     
         // Update inputs
         const updatedInputs = gate.inputs.map(port => 
           port.id === targetedPort.id 
             ? { ...port, value: selectedPort.value }
             : port
         );
         console.log(gate.type)
         // Compute output value based on gate type
         const outputValue = computeGateOutput(gate.type, updatedInputs);
     
         return {
           ...gate,
           inputs: updatedInputs,
           output: { ...gate.output, value: outputValue }
         };
       });
     };