import { connection, Gate, Port } from "@/app/gate/types";

export function updateGateConnectionsPosition(prevConnection:connection[],updatedGate:Gate):connection[]{
    return prevConnection.map(conn=>{
        const startMatch=updatedGate.inputs.find(port=>port.id===conn.start.id) || (updatedGate.output.id===conn.start.id?updatedGate.output:null)
        const endMatch=updatedGate.inputs.find(port=>port.id===conn.end.id) || (updatedGate.output.id===conn.end.id?updatedGate.output:null)
        
        const updatedStartPort:Port=startMatch?{...conn.start,position:startMatch.position}:conn.start
        const updatedEndPort:Port=endMatch?{...conn.end,position:endMatch.position}:conn.end

        return {
            start:updatedStartPort,
            end:updatedEndPort
        }

    })

}
