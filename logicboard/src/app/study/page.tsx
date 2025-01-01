"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Gate, Point, Res } from '../gate/types'
import { calDeviceResolution } from '../gate/utils/calResolution'
import { DrawGatesNode } from './gates/utils/drawGates'
import { GateCreator } from './gates/GateCreator'
import { generateGatePosition } from './gates/utils/getPosition'
import { getCanvasPoints } from '../gate/canvasUtils'
import { isPointInGate } from './findGate'


const Study = () => {
    //device resolution setup
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const [res,setRes]=useState<Res>({width:0,height:0})

    const [isDragging,setIsDragging]=useState<boolean>(false)

    const [gateNodes,setGateNodes]=useState<Gate[]>([])
    const [selectedGate,setSelectedGate]=useState<Gate | null>(null)

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
        DrawGatesNode(canvasRef.current,gateNodes)
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
    const handleMouseUp=()=>{
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
    const handleTouchUp=()=>{
        setIsDragging(false)
    }

    const onTouchDown=(point:Point)=>{
        const clickedGate=gateNodes.find(gate=>isPointInGate(point,gate))
           
  
        if(clickedGate){
            setSelectedGate(clickedGate)
        }
    }
    const onTouchMove=(point:Point)=>{
        if(!selectedGate) return
        setSelectedGate(prevGate => {
            if (!prevGate) return null;
    
            // Update the position of the selected gate
           const updatedGate=GateCreator.updatePosition(prevGate,point)
    
            // Update gateNodes with the modified gate
            setGateNodes(prevGateNodes => 
                prevGateNodes.map(gate =>
                    gate.id === updatedGate.id ? updatedGate : gate
                )
            );
    
            return updatedGate; // Update selectedGate as well
        });
    }
    useEffect(()=>{
      canvasDrawerHandler()
        console.log(gateNodes)
    },[gateNodes,selectedGate])
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