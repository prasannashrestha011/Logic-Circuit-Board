"use client"
import React, { useEffect, useRef, useState } from 'react'
import { connection, Gate, Point, Port, Res } from './types'
import {  adjustPositions, Gates, portInputs } from './structure'
import { drawCanvas, getCanvasPoints } from './canvasUtils'
import { calDistance } from './utils/calDistance'
import { computeGateOutput, updateGates } from './utils/calOutput'
import { calDeviceResolution } from './utils/calResolution'


const GatePage = () => {
  const [canvasResolution,setCanvasResolution]=useState<Res>()
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const [isDrawing,setIsDrawing]=useState<boolean>(false)
    const [ports,setPorts]=useState<Port[]>(portInputs)
    const [gates,setGates]=useState<Gate[]>(Gates)
    const  [connections,setConnections]=useState<connection[]>([])

    const [selectedPort,setSelectedPort]=useState<Port | null>(null)


    const handleResize=()=>{
      setCanvasResolution(calDeviceResolution())
    }
    //####for getting the ports from mouse/touch down and up event###
    const findPortAtPoint=(point:Point):Port | null=>{
      const clickedPort=ports.find(port=>{
        const distance=calDistance(port,point)
         return distance<=port.radius
      })
      if(clickedPort) return clickedPort
      for(const gate of  gates){
         const targetedGatePort=gate.inputs.find(port=>{
           const distance=calDistance(port,point) 
           return distance<=port.radius
         })
         if(targetedGatePort) return targetedGatePort
         const outputPort=gate.output
         const outputDistance=Math.sqrt(Math.pow(outputPort.position.x-point.x,2) + Math.pow(outputPort.position.y-point.y,2))
         if(outputDistance<=outputPort.radius) return outputPort
         
      }
      return null
    }


    //@@@Handling mouse events @@@
    const handleMouseDown=(e:React.MouseEvent<HTMLCanvasElement>)=>{
      if(!canvasRef.current){
        console.log("no ref")
        return
      } 
      
      const points=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
  
      onTouchDown(points)
    }
    const handleMouseMove=(e:React.MouseEvent<HTMLCanvasElement>)=>{
      if(!canvasRef.current) return 
      const points=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
      onTouchMove(points)
    }
    const handleMouseUp=(e:React.MouseEvent<HTMLCanvasElement>)=>{
      if(!canvasRef.current) return 
      setIsDrawing(false)
      const points=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
      onTouchUp(points)
    }


    //@@@@ Handling mobile touch events @@@ 
    const handleTouchStart=(e:React.TouchEvent<HTMLCanvasElement>)=>{
      if(!canvasRef.current) return 
      const clientX=e.touches[0].clientX
      const clientY=e.touches[0].clientY
      const points=getCanvasPoints(canvasRef.current,clientX,clientY)
      onTouchDown(points)
    }
    const handleTouchMove=(e:React.TouchEvent<HTMLCanvasElement>)=>{
       if(!canvasRef.current) return 
       const clientX=e.touches[0].clientX
       const clientY=e.touches[0].clientY
       const points=getCanvasPoints(canvasRef.current,clientX,clientY)
       onTouchMove(points)
    }
    const handleTouchEnd=(e:React.TouchEvent<HTMLCanvasElement>)=>{
      if(!canvasRef.current) return 
      const clientX=e.changedTouches[0].clientX
      const clientY=e.changedTouches[0].clientY
      const points=getCanvasPoints(canvasRef.current,clientX,clientY)
      onTouchUp(points)
    }

    //@@ for handling the touch events
    //@@ works for both pc and mobile devices

    //@@  touchDown will for getting the selected port 
    //@@ it retrives the coordinate where user clicked and check if the port is available on that port
    const onTouchDown=(point:Point)=>{
      if(!canvasRef.current) return 
       const clickedPort=findPortAtPoint(point)
       console.log(clickedPort)
       if(clickedPort){
        setIsDrawing(true)
        setSelectedPort(clickedPort)
       }
    }

    //@@touch move is specifically drawing the temporary line design for visualization
    const onTouchMove=(point:Point)=>{
      if(!canvasRef.current || !isDrawing || !selectedPort) return 
      const canvas=canvasRef.current
      console.log("on move...")
      const ctx=canvas.getContext('2d')
      if(!ctx) return 

      drawCanvasHandler() //added before tempo drawing 
      ctx.beginPath()
      ctx.strokeStyle="black"
      ctx.moveTo(selectedPort?.position.x,selectedPort?.position.y)
      ctx.lineTo(point.x,point.y)
      ctx.stroke()
    }

    //@@ after the user leave the mouse , it will check if the last coordiante lies on ports of gates
    //@@ if lies on certain port, it will create new connection {selectedPort,targeted port} and push to the connection array
    const onTouchUp=(point:Point)=>{
      if(!canvasRef.current || !selectedPort) return 
      
      setIsDrawing(false)
     
   
      const targetedPort=findPortAtPoint(point)  
      if(targetedPort && selectedPort){
     
      const isValidConnection = 
      selectedPort.id !== targetedPort.id && // Different ports
      selectedPort.type !== targetedPort.type && // Different port types
      !(selectedPort.type === "input" && targetedPort.type === "output"); // Correct direction
        if(isValidConnection){
          //@to sync the gate input port with input port I have assigned the initial input port value to the targeted gate input port
        const updatedTargetport={...targetedPort,value:selectedPort.value} 
        
        console.log("Your targeted port ",updatedTargetport)
        
        setGates(prevGate=>updateGates(prevGate,targetedPort,selectedPort))
        
        //@@ sets connections
        console.log("Updated port",updatedTargetport)
          setConnections([
            ...connections,
            {
              start:selectedPort,
              end:updatedTargetport
            }
          ])
        }

        
      }

     
      drawCanvasHandler()
      setSelectedPort(null)
   
    }


   
    
    // Separate function for computing gate output
  

    const handleClickEvent=(e:React.MouseEvent<HTMLCanvasElement>)=>{
      if(!canvasRef.current) return 
      const points=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
      toggleClick(points)
    }

    //@@runs twice:
    //@@ drag & drop
    const toggleClick=(point:Point)=>{
      const clickedPort=findPortAtPoint(point)
      
      if(!clickedPort) return 

      const newValue=!clickedPort.value
      if(clickedPort.type==="input"){
  
        setPorts(prevPort=>{
          return prevPort.map(port=>{
            return port.id===clickedPort.id?{...port,value:newValue}:port
          })
        })
      
        setGates(prevGates=>{
          return prevGates.map(gate=>{
            
             const updatedTargetInputs=gate.inputs.map(port=>{
                return connections.some(conn=>conn.start.id===clickedPort.id && conn.end.id===port.id)?{...port,value:newValue}:port
             })
             const outputValue=computeGateOutput(gate.type,updatedTargetInputs)
            
             connections.forEach((conn) => {
              if (conn.start.id === gate.output.id) {
                const targetGate = gates.find((g) =>
                  g.inputs.some((p) => p.id === conn.end.id)
                );
                if (targetGate) {
                  targetGate.inputs = targetGate.inputs.map((p) =>
                    p.id === conn.end.id
                      ? { ...p, value: outputValue }
                      : p
                  );
                  targetGate.output.value = computeGateOutput(
                    targetGate.type,
                    targetGate.inputs
                  );
                }
              }
            });
            console.log("updated connection gxxr",connections)
             return {
              ...gate,
              inputs:updatedTargetInputs,
              output:{...gate.output,value:outputValue}
             }
          })
        })
        drawCanvasHandler()
      }
     
   
      
   
    }

    //@@ for removing the connections , still needs to be coded to remove specific connection
   

    //@@for drawing the canvas @@@@
    const drawCanvasHandler=()=>{
        if(!canvasRef.current) return 
        const canvas=canvasRef.current

        drawCanvas(canvas,ports,gates,connections)
    }


    useEffect(()=>{
      drawCanvasHandler()
      
    },[ports,connections,selectedPort])
    useEffect(()=>{
      handleResize()
    },[])
    useEffect(() => {
      if (canvasResolution) {
        const { adjustedPorts, adjustedGates } = adjustPositions(canvasResolution.width, canvasResolution.height)
        setPorts(adjustedPorts)
        setGates(adjustedGates)
      }
    }, [canvasResolution])
    useEffect(() => {
  const portrait = window.matchMedia("(orientation: portrait)");

  const handleOrientationChange = (e:MediaQueryListEvent) => {
    if (e.matches) {
      // Portrait mode
      handleResize();
    } else {
      // Landscape mode
      handleResize();
    }
  };

  portrait.addEventListener("change", handleOrientationChange);

  // Cleanup event listener on component unmount
  return () => {
    portrait.removeEventListener("change", handleOrientationChange);
  };
}, []);

  return (
    <div
    className='flex items-center justify-center my-5'
    >
        <canvas
        ref={canvasRef}
        onClick={handleClickEvent}
        
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className='border border-black'
        width={canvasResolution?.width}
        height={canvasResolution?.height}
        />
    </div>
  )
}

export default GatePage