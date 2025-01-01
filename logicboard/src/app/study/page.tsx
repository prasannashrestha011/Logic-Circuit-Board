"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Gate, Point, Res } from '../gate/types'
import { calDeviceResolution } from '../gate/utils/calResolution'
import {  getCanvasPoints } from '../gate/canvasUtils'
import GateFactory from './gates/GateFactory'
import { DrawAndGate } from './gates/GatesDiagram'

const Study = () => {
    const [res,setRes]=useState<Res>({width:300,height:200})
    const canvasRef=useRef<HTMLCanvasElement | null>(null)
    const [gates,setGates]=useState<Gate[]>([])

    useEffect(()=>{
        const {width,height}=calDeviceResolution()
        setRes({width,height})
    },[])

    const handleMoveDown=(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current) return 
        const points=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        console.log(points)
    }
    const handleClick = () => {
        setGates(prev => [...prev, GateFactory.create()]);
    };

    const handleTargetedGate=(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!canvasRef.current) return 
        const touchedPoints=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
        const targetedGate = gates.find(gate => 
            isPointInGate(touchedPoints, gate)
        );
        console.log("your targeted gate",targetedGate)
    }
    const isPointInGate = (point: Point, gate: Gate): boolean => {
        const { position, width, height } = gate;
        
        // Calculate gate boundaries
        const left = position.x - width/2;
        const right = position.x + width/2;
        const top = position.y - height/2;
        const bottom = position.y + height/2;
        
        // Check if point is within boundaries
        return (
            point.x >= left &&
            point.x <= right &&
            point.y >= top &&
            point.y <= bottom
        );
    };

    const drawCanvasHandler=()=>{
        if(!canvasRef.current) return 
        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')
         if(!ctx) return 
        gates.forEach(gate=>DrawAndGate(ctx,gate))
    }
    useEffect(()=>{
        console.log(gates)
        drawCanvasHandler()
    },[gates])
  return (
    <div className='p-3 flex flex-col items-center justify-center'>
        <button onClick={handleClick}>And</button>
        <canvas
        onClick={handleTargetedGate}
        ref={canvasRef}
        className='border border-black'
         width={res.width}
         onMouseDown={handleMoveDown}
         height={res.height *0.80}
        />
    </div>
  )
}

export default Study