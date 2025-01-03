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
import { updateGateConnectionsPosition } from './gates/utils/connnections'


const Study = () => {
    //device resolution setup
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const [res,setRes]=useState<Res>({width:0,height:0})

    const [isDragging,setIsDragging]=useState<boolean>(false)
    const [isDrawing,setIsDrawing]=useState<boolean>(false)

    const [portNodes,setPortNodes]=useState<Port[]>([])
    const [gateNodes,setGateNodes]=useState<Gate[]>([])


    const [selectedGate,setSelectedGate]=useState<Gate | null>(null)

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
        const clickedPortNode=portNodes.find(port=>isPointInPortNode(point,port))
        if(clickedPortNode){
            console.log("you clicked this port node ",clickedPortNode)
            setSelectedPort(clickedPortNode)
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

        setSelectedPort(prevPort=>{
            if(!prevPort) return null
            const updatedPort=GateCreator.updatePortPosition(prevPort,point)

            setPortNodes((prevPortNode) =>
                prevPortNode.map((port) => 
                    port.id === updatedPort.id ? updatedPort : port
                )
            );
            
            return updatedPort
        })
        if(!canvasRef.current || !selectedPort || !isDrawing) return 
        DrawTempoLine(canvasRef.current,selectedPort.position,point,canvasDrawerHandler)
      
        
    }
    const onTouchUp=(point:Point)=>{
     
        setIsDrawing(false)
        setIsDragging(false)
        setSelectedGate(null)
        setSelectedPort(null)
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
        console.log('targeted port',targetedPort)
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
            <button onClick={()=>handlePortCreation("output-port")}>Output</button>
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