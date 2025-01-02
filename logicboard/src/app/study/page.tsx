"use client"
import React, { useEffect, useRef, useState } from 'react'
import { connection, Gate, Point, Port, Res } from '../gate/types'
import { calDeviceResolution } from '../gate/utils/calResolution'
import { DrawGatesNode } from './gates/utils/drawGates'
import { GateCreator } from './gates/GateCreator'
import { generateGatePosition } from './gates/utils/getPosition'
import { getCanvasPoints } from '../gate/canvasUtils'
import { isPointInGate } from './findGate'
import { calDistance } from '../gate/utils/calDistance'


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
        setIsDragging(false)
        setSelectedGate(null)
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
     
        const clientX=e.touches[0].clientX
        const clientY=e.touches[0].clientY

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
            console.log("selected port:",clickedInputPort)
            if(clickedInputPort) {
                setSelectedPort(clickedInputPort)
                return
            }
            const outputPortDistance=calDistance(gate.output,point)
            if (outputPortDistance <= gate.output.radius) {
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
                const updatedConnection=prevConnection.map(conn=>{
                    const startMatch=updatedGate.inputs.find(port=>port.id===conn.start.id) || (updatedGate.output.id===conn.start.id?updatedGate.output:null)
                    const endMatch=updatedGate.inputs.find(port=>port.id===conn.end.id) || (updatedGate.output.id===conn.end.id?updatedGate.output:null)
                    
                    const updatedStartPort:Port=startMatch?{...conn.start,position:startMatch.position}:conn.start
                    const updatedEndPort:Port=endMatch?{...conn.end,position:endMatch.position}:conn.end

                    return {
                        start:updatedStartPort,
                        end:updatedEndPort
                    }

                })
            return updatedConnection
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
        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')
        if(!ctx) return 
        ctx.clearRect(0,0,canvas.width,canvas.height)
        canvasDrawerHandler()
        ctx.beginPath()
        ctx.moveTo(selectedPort.position.x,selectedPort.position.y)
        ctx.lineTo(point.x,point.y)
        ctx.stroke()
      
        
    }
    const onTouchUp=(point:Point)=>{
        let targetedPort=null
        for(const gate of gateNodes){
            targetedPort=gate.inputs.find(port=>{
                const distance=calDistance(port,point)
                return distance<=port.radius
            })
           

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
       setIsDrawing(false)
       
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