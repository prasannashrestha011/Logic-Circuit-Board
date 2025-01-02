"use client"
import React, { useEffect, useRef, useState } from 'react'
import { connection, Gate, Point, Port, Res } from '../gate/types'
import { calDeviceResolution } from '../gate/utils/calResolution'
import { DrawGatesNode, DrawTempoLine } from './gates/utils/drawGates'
import { GateCreator } from './gates/GateCreator'
import { generateGatePosition } from './gates/utils/getPosition'
import { getCanvasPoints } from '../gate/canvasUtils'
import { isPointInGate } from './findGate'
import { calDistance } from '../gate/utils/calDistance'
import { updateConnectionsPosition } from './gates/utils/connnections'


const Study = () => {
    //device resolution setup
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const [res,setRes]=useState<Res>({width:0,height:0})

    const [isDragging,setIsDragging]=useState<boolean>(false)
    const [isDrawing,setIsDrawing]=useState<boolean>(false)
    const [gateNodes,setGateNodes]=useState<Gate[]>([])
    const [selectedGate,setSelectedGate]=useState<Gate | null>(null)
    const [selectedPort,setSelectedPort]=useState<Port | null>(null)

    const [connections,setConnections]=useState<connection[]>([])
    useEffect(()=>{
        const {width,height}=calDeviceResolution()
        setRes({width,height})
    },[])

    const handleGateCreation=(type:string)=>{
        const gatePosition=generateGatePosition()
        const newGate:Gate=GateCreator.create(type,gatePosition)
        setGateNodes(prevGateNode=>[...prevGateNode,newGate])
    }

    const canvasDrawerHandler=()=>{
        if(!canvasRef.current) return 
        DrawGatesNode(canvasRef.current,gateNodes,connections)
    }
    const handleMouseDown=(e:React.MouseEvent<HTMLCanvasElement>)=>{
   
        if(!canvasRef.current) return 
        setIsDragging(true)
        const point=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        onTouchDown(point)
    }
    const handleMouseMove=(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current || !isDragging ) return
        const point=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        onTouchMove(point)
    }
    const handleMouseUp=(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current || !isDragging ) return
        const point=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        onTouchUp(point)
      
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
            return
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
           const updatedGate=GateCreator.updatePosition(prevGate,point)
            console.log(updatedGate)
        
            setConnections(prevConnection=>{
                return updateConnectionsPosition(prevConnection,updatedGate)
            })
            
            
            // Update gateNodes with the modified gate
            setGateNodes(prevGateNodes => 
                prevGateNodes.map(gate =>
                    gate.id === updatedGate.id ? updatedGate : gate
                )
            );
    
            return updatedGate; // Update selectedGate as well
        });
        if(!canvasRef.current || !selectedPort || !isDrawing) return 
        DrawTempoLine(canvasRef.current,selectedPort.position,point,canvasDrawerHandler)
      
        
    }
    const onTouchUp=(point:Point)=>{
        setIsDrawing(false)
        setIsDragging(false)
        setSelectedGate(null)
        let targetedPort=null
        for(const gate of gateNodes){
            targetedPort=gate.inputs.find(port=>{
                const distance=calDistance(port,point)
                return distance<=port.radius
            })
            if(targetedPort) return 
            const outputPortDistance=calDistance(gate.output,point)
          
            if (outputPortDistance <= gate.output.radius) {
                console.log("your distance ",outputPortDistance)
                targetedPort=gate.output
            }


        }
       if(selectedPort && targetedPort){
        setConnections(prevConnections => [
            ...prevConnections, 
            {
                start: selectedPort, 
                end: targetedPort
            }
        ]);
       }
      
       canvasDrawerHandler()
    }
    useEffect(()=>{
      canvasDrawerHandler()
      
        console.log(connections)
    },[gateNodes,selectedGate,selectedPort,connections])
  return (
    <div>
        <div className='flex gap-3'>
            <button onClick={()=>handleGateCreation("and")}>And Gate</button>
            <button onClick={()=>handleGateCreation("or")}>Or Gate</button>
            <button onClick={()=>handleGateCreation("nand")}>Nand Gate</button>
            <button onClick={()=>handleGateCreation("nor")}>Nor Gate</button>
            <button onClick={()=>handleGateCreation("x-or")}>X-Or Gate</button>
            <button onClick={()=>handleGateCreation("not")}>Not Gate</button>
        </div>
        <canvas
           className='border border-black z-20'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}

            onTouchStart={handleTouchDown}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchUp}
            ref={canvasRef}
            width={res.width}
            height={res.height}    
        />
    </div>
  )
}

export default Study