import {  Point, } from "@/app/gate/types";

export interface PortNode{
    id:string 
    type:string 
    value:boolean | null
    radius:number
    position:Point,
    width:number 
    height:number
}