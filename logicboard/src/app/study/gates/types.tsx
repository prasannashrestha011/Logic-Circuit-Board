import {  Port } from "@/app/gate/types";

interface NodeInfo{
    gateId:string 
    portId:Port
}
export interface NodeConnection{
    start:NodeInfo
    end:NodeInfo
}