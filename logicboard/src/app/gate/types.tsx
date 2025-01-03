export interface Res{
    width:number 
    height:number
}
export interface Point{
    x:number 
    y:number 
}
export interface Port{
    id:string 
    type:string 
    value:boolean | null
    radius:number
    position:Point
    width?:number 
    height?:number  
}
export interface Gate{
    id:string 
    position:Point,
    width:number,
    height:number
    type:string
    inputs:Port[]
    output:Port
}
export interface connection{
    start:Port
    end:Port
}
