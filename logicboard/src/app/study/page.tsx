"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Gate, Res } from '../gate/types'
import { calDeviceResolution } from '../gate/utils/calResolution'
import { DrawGatesNode } from './gates/utils/drawGates'
import { GateCreator } from './gates/GateCreator'
import { generateGatePosition } from './gates/utils/getPosition'


const Study = () => {
    //device resolution setup
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const [res,setRes]=useState<Res>({width:0,height:0})
    const [gateNodes,setGateNodes]=useState<Gate[]>([])


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
    useEffect(()=>{
      canvasDrawerHandler()
      console.log(gateNodes)
    },[gateNodes])
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
           className='border border-black'
            ref={canvasRef}
            width={res.width}
            height={res.height}    
        />
    </div>
  )
}

export default Study