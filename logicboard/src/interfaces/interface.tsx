export interface ResolutionProp{
    width:number 
    height:number 
}
export interface Point{
    x:number 
    y:number 
  }
  export  interface Port{
    id:string 
    position:Point
    type:string
    value?:boolean
    radius:number
  }
  export  interface Gate{
    id:string 
    position:Point
    inputPorts:Port[]
    outputPort:Port;
    type:'and'
  }
  export interface connection{
    source:Port
    target:Port
  }