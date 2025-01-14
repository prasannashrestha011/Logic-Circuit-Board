"use client"
import React, { useEffect, useRef, useState } from 'react'
import { connection, Gate, Point, Port, Res } from '../gate/types'
import { calDeviceResolution } from '../gate/utils/calResolution'
import { DrawGatesNode, DrawTempoLine } from './gates/utils/drawGates'
import { GateCreator } from './gates/GateCreator'
import { generatePosition } from './gates/utils/getPosition'
import { getCanvasPoints } from '../gate/canvasUtils'
import { isPointInGate, isPointInPortNode } from './findGate'
import { calDistance } from '../gate/utils/calDistance'
import { updateGateConnectionsPosition, updatePortConnectionPosition } from './gates/utils/connnections'
import { computeGateOutput } from '../gate/utils/calOutput'


const Study = () => {
    //device resolution setup
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const [res,setRes]=useState<Res>({width:0,height:0})

    const [isDragging,setIsDragging]=useState<boolean>(false)
    const [isDrawing,setIsDrawing]=useState<boolean>(false)
    const [wasDragging,setWasDragging]=useState<boolean>(false)
        const [portNodes,setPortNodes]=useState<Port[]>([])
        const [gateNodes,setGateNodes]=useState<Gate[]>([])
      

    const [selectedGate,setSelectedGate]=useState<Gate | null>(null)

    const [isDraggingPort,setIsDraggingPort]=useState<boolean>(false)

    const [selectedPort,setSelectedPort]=useState<Port | null>(null)

    const [connections,setConnections]=useState<connection[]>([])
    useEffect(()=>{
        const {width,height}=calDeviceResolution()
        setRes({width,height})
    },[])

    const handleGateCreation=(type:string)=>{
        const gatePosition=generatePosition()
        const newGate:Gate=GateCreator.createGate(type,gatePosition)
        setGateNodes(prevGateNode=>[...prevGateNode,newGate])
    }
    const handlePortCreation=(type:string)=>{
        const portPosition=generatePosition()
        const newPort=GateCreator.createPort(type,portPosition)
        setPortNodes(prevPort=>[...prevPort,newPort])
    }

    const canvasDrawerHandler=()=>{
        if(!canvasRef.current) return 
        DrawGatesNode(canvasRef.current,portNodes,gateNodes,connections)
    }
    const handleMouseDown=(e:React.MouseEvent<HTMLCanvasElement>)=>{
   
        if(!canvasRef.current) return 
        setIsDragging(true)
        setWasDragging(false)
        const point=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        onTouchDown(point)
    }
    const handleMouseMove=(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current || !isDragging ) return
        setWasDragging(true)
        const point=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        onTouchMove(point)
    }
    const handleMouseUp=(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current || !isDragging ) return
       
        const point=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        onTouchUp(point)
        setIsDragging(false)
      
    }

    const handleTouchClick=(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current || isDragging || wasDragging || isDraggingPort || isDrawing) return 
        const point=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        onTouchClick(point)
        setWasDragging(false)
    }
    const handleTouchDown=(e:React.TouchEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current) return 
        
        setIsDragging(true)
        const clientX=e.touches[0].clientX
        const clientY=e.touches[0].clientY

        const point=getCanvasPoints(canvasRef.current,clientX,clientY)
        onTouchDown(point)
    }
    const handleTouchMove=(e:React.TouchEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current || !isDragging) return 
      
        const clientX=e.touches[0].clientX
        const clientY=e.touches[0].clientY

        const point=getCanvasPoints(canvasRef.current,clientX,clientY)
        onTouchMove(point)
    }
    const handleTouchUp=(e:React.TouchEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current || !isDragging) return 
     
        const clientX=e.changedTouches[0].clientX
        const clientY=e.changedTouches[0].clientY

        const point=getCanvasPoints(canvasRef.current,clientX,clientY)
        onTouchUp(point)
    }

    const onTouchDown=(point:Point)=>{
      
        const clickedGate=gateNodes.find(gate=>isPointInGate(point,gate))
           
  
        if(clickedGate){
            setSelectedGate(clickedGate)
           
        }
        const draggedPortNode=portNodes.find(port=>isPointInPortNode(point,port))
        console.log("asdfsadf ",draggedPortNode)
        if(draggedPortNode){
            console.log("you clicked this port node ",draggedPortNode)
            setSelectedPort(draggedPortNode)
           setIsDraggingPort(true)
           return
        }

        const clickedPortNode=portNodes.find(port=>{
            const distance=calDistance(port,point)
            return distance<=port.radius
        })
        if(clickedPortNode){

        setSelectedPort(clickedPortNode)
        }
        setIsDrawing(true)
        for(const gate of gateNodes){
            const clickedInputPort=gate.inputs.find(port=>{
                const distance=calDistance(port,point)
                return distance<=port.radius
            })
       
            if(clickedInputPort) {
          
                setSelectedPort(clickedInputPort)
                return
            }
            const outputPortDistance=calDistance(gate.output,point)
            
            if (outputPortDistance <= gate.output.radius) {
                console.log("your distance selected ",outputPortDistance)
                setSelectedPort(gate.output);
            }
        }
    }
    const onTouchMove=(point:Point)=>{
       
        setSelectedGate(prevGate => {
            if (!prevGate) return null;
    
            // Update the position of the selected gate
           const updatedGate=GateCreator.updateGatePosition(prevGate,point)
        
        
            setConnections(prevConnection=>{
                return updateGateConnectionsPosition(prevConnection,updatedGate)
            })
            
            
            // Update gateNodes with the modified gate
            setGateNodes(prevGateNodes => 
                prevGateNodes.map(gate =>
                    gate.id === updatedGate.id ? updatedGate : gate
                )
            );
    
            return updatedGate; // Update selectedGate as well
        });

        if(isDraggingPort){
            setSelectedPort(prevPort=>{
                if(!prevPort) return null
                const updatedPort=GateCreator.updatePortPosition(prevPort,point)
    
                setConnections(prevConn=>{
                    return updatePortConnectionPosition(prevConn,updatedPort)
                })
                setPortNodes((prevPortNode) =>
                    prevPortNode.map((port) => 
                        port.id === updatedPort.id ? updatedPort : port
                    ) 
                );
                
                return updatedPort
            })
        }
        if(!canvasRef.current || !selectedPort || !isDrawing) return 
        DrawTempoLine(canvasRef.current,selectedPort.position,point,canvasDrawerHandler)
      
        
    }

    
    
    const onTouchUp=(point:Point)=>{
     
        setIsDrawing(false)
        setIsDragging(false)
        setSelectedGate(null)
        setSelectedPort(null)
        setIsDraggingPort(false)
        let targetedPort=null
        for(const gate of gateNodes){
            targetedPort=gate.inputs.find(port=>{
                const distance=calDistance(port,point)
                return distance<=port.radius
            })
        
            const outputPortDistance=calDistance(gate.output,point)
          
            if (outputPortDistance <= gate.output.radius) {
                console.log("your distance ",outputPortDistance)
                targetedPort=gate.output
            }


        }
        if(!targetedPort){
            targetedPort=portNodes.find(port=>{
                const distance=calDistance(port,point)
                return distance<=port.radius
            })
        }
        console.log('selectedPort',selectedPort)
        console.log('targeted port',targetedPort)
       if(selectedPort && targetedPort){
        console.log("setting the connection ......")

        const startPort=selectedPort.type=="gate-input" && targetedPort
        const endPort=targetedPort.type=="input-port" && selectedPort

        const hasConnections=
        connections.some(conn=>conn.start.id===selectedPort.id || conn.end.id===selectedPort.id) ||
        connections.some(conn=>conn.start.id===targetedPort.id || conn.end.id===targetedPort.id)

        const isInvalidConnection=(selectedPort?.id===targetedPort.id)
   
        if(isInvalidConnection) return 

        if(hasConnections) return
        if(startPort && endPort){
            setConnections(prevConn=>[
                ...prevConn,
                {
                    start:startPort,
                    end:endPort
                }
            ])
        }else{
            setConnections(prevConnections => [
                ...prevConnections, 
                {
                    start: selectedPort, 
                    end: targetedPort
                }
            ]);
        }
        setGateNodes(prevGate=>{
            return prevGate.map(gate=>{
                const updatedInputPorts=gate.inputs.map(port=>{
                    return port.id===targetedPort.id?{...port,value:selectedPort.value}:port                     
                })
                const updatedOutputValue=computeGateOutput(gate.type,updatedInputPorts)
                console.log("initla outupt, ",updatedOutputValue)
                return {
                    ...gate,
                    inputs:updatedInputPorts,
                    output:{...gate.output,value:updatedOutputValue}
                }
            })
        })
       
       }
      
       canvasDrawerHandler()
    }

    const onTouchClick=(point:Point)=>{
        if(isDragging || isDrawing || isDraggingPort) return 
        const clickedPort=findThePortAtThePoint(point)
        if(!clickedPort) return 
   
        const newValue = !clickedPort.value ;

        console.log("toggled port ",clickedPort)

        if(clickedPort.type=="input-port" || clickedPort.type=="output-port"){
            setPortNodes(prevPortNode=>(
                prevPortNode.map(port=>(
                    clickedPort.id===port.id?{...port,value:newValue}:port
                ))
            ))
        }
        setGateNodes(prevGate=>{
            return prevGate.map(gate=>{
                const targetedInputNodes=gate.inputs.map(port=>{
                    return connections.some(conn=>conn.start.id===clickedPort.id && conn.end.id===port.id)?{...port,value:newValue}:port
                })
                console.log("your gate type",gate.type)
                const updatedOutputValue=computeGateOutput(gate.type,targetedInputNodes)
                console.log("final output",updatedOutputValue)
                      connections.forEach((conn) => {
                              if (conn.start.id === gate.output.id) {
                                const targetGate = gateNodes.find((g) =>
                                  g.inputs.some((p) => p.id === conn.end.id)
                                );
                                if (targetGate) {
                                  targetGate.inputs = targetGate.inputs.map((p) =>
                                    p.id === conn.end.id
                                      ? { ...p, value: updatedOutputValue }
                                      : p
                                  );
                                  targetGate.output.value = computeGateOutput(
                                    targetGate.type,
                                    targetGate.inputs
                                  );
                                }
                                console.log(updatedOutputValue, " is your idss")
                              const finalOutputPort=portNodes.find((outputPort)=>{
                                 return conn.end.id===outputPort.id
                              })
                              console.log("final output port",finalOutputPort)
                              if(finalOutputPort){
                             
                                setPortNodes(prevOutputPort=>{
                                  const updatedOutputPorts=prevOutputPort.map((port)=>{
                                   if( port.id===finalOutputPort.id){
                                    console.log("found final output port",port)
                                     return {
                                      ...port,
                                      value:updatedOutputValue
                                     }
                                   }
                                   return port
                                  })
                                  return updatedOutputPorts
                                  
                                })
                              }
                              }
                            });
                return {
                    ...gate,
                    inputs:targetedInputNodes,
                    output:{...gate.output,value:updatedOutputValue}
                }
            })
        })

    }
    const findThePortAtThePoint=(point:Point):Port | null=>{
        const clickedPorts=portNodes.find(port=>{
            const distance=calDistance(port,point)
            return distance<=port.radius
        })
        if(clickedPorts) return clickedPorts

        //@@if the port is from the gate node 
        for(const gate of gateNodes){
            const clickedInputPort=gate.inputs.find(port=>{
                const distance=calDistance(port,point)
                return distance<=port.radius
            })
            if(clickedInputPort) return clickedInputPort
            const outputDistance=calDistance(gate.output,point)
            const clickedOutputPort=outputDistance<=gate.output.radius && gate.output

            if(clickedOutputPort) return clickedOutputPort
        }   
        return null
    }
    useEffect(()=>{
        console.log(connections)
      canvasDrawerHandler()
    
    },[portNodes,gateNodes,selectedGate,selectedPort,connections])
  return (
    <div>
        <div className='flex gap-3'>
            <button onClick={()=>handleGateCreation("and")}>And Gate</button>
            <button onClick={()=>handleGateCreation("or")}>Or Gate</button>
            <button onClick={()=>handleGateCreation("nand")}>Nand Gate</button>
            <button onClick={()=>handleGateCreation("nor")}>Nor Gate</button>
            <button onClick={()=>handleGateCreation("x-or")}>X-Or Gate</button>
            <button onClick={()=>handleGateCreation("not")}>Not Gate</button>
            <button onClick={()=>handlePortCreation("input-port")}>Input</button>
            <button onClick={()=>handlePortCreation("output-port")} >Output</button>
        </div>
        <canvas
           className='border border-black z-20 outline-none'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        
            onTouchStart={handleTouchDown}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchUp}

            onClick={handleTouchClick}
            ref={canvasRef}
            width={res.width}
            height={res.height}    
        />
    </div>
  )
}

export default Study