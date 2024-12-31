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
    const [inputPorts,setInputPorts]=useState<Port[]>(portInputs)
    const [outputPorts,setOutputPorts]=useState<Port[]>([])
    const [gates,setGates]=useState<Gate[]>(Gates)
    const  [connections,setConnections]=useState<connection[]>([])

    const [selectedPort,setSelectedPort]=useState<Port | null>(null)


    const handleResize=()=>{
      setCanvasResolution(calDeviceResolution())
    }
    //####for getting the ports from mouse/touch down and up event###
    const findPortAtPoint=(point:Point):Port | null=>{
      const clickedInputPort=inputPorts.find(port=>{
        const distance=calDistance(port,point)
         return distance<=port.radius
      })
      if(clickedInputPort) return clickedInputPort
      
      const clickedOutputPort=outputPorts.find(port=>{
        const distance=calDistance(port,point)
        return distance<=port.radius
      })
      if(clickedOutputPort) return clickedOutputPort
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
      setIsDrawing(false)
      if(!canvasRef.current || !selectedPort) return 
      
     
     
   
      const targetedPort=findPortAtPoint(point)  
      if(targetedPort && selectedPort){
          const hasConnections= connections.find(c=>c.start.id==selectedPort.id || c.end.id==selectedPort.id)
          if(hasConnections) return



      const isValidConnection = 
      selectedPort.id !== targetedPort.id && // Different ports
      selectedPort.type !== targetedPort.type && // Different port types
      !(selectedPort.type === "input" && targetedPort.type === "output") && selectedPort.type!=="final-output"; // Correct direction
        if(isValidConnection){
          //@to sync the gate input port with input port I have assigned the initial input port value to the targeted gate input port
        const updatedTargetport={...targetedPort,value:selectedPort.value} 
        
   
        
        setGates(prevGate=>updateGates(prevGate,targetedPort,selectedPort))
        
        //@@ sets connections
      
        if(selectedPort.type=="gate-input" && updatedTargetport.type=="input"){
   
          setConnections([
            ...connections,
            {
              start:updatedTargetport,
              end:selectedPort
            }
          ])
          return
        }
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
      if(!canvasRef.current || isDrawing) return 
      console.log("triggered",isDrawing)
      const points=getCanvasPoints(canvasRef.current,e.clientX,e.clientY)
      toggleClick(points)
    }

    //@@runs twice:
    //@@ drag & drop
    const toggleClick=(point:Point)=>{
      const clickedPort=findPortAtPoint(point)
      
      if(!clickedPort) return 
   
      const newValue=!clickedPort.value
      console.log("clicked port ",clickedPort)
      if(clickedPort.type==="input"){
  
        setInputPorts(prevPort=>{
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

             //@@ for handling the output as input for another logic operation@@
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
                console.log(outputPorts, " is your idss")
              const finalOutputPort=outputPorts.find((outputPort)=>{
                 return conn.end.id===outputPort.id
              })
              console.log("final output port",finalOutputPort)
              if(finalOutputPort){
             
                setOutputPorts(prevOutputPort=>{
                  const updatedOutputPorts=prevOutputPort.map((port)=>{
                   if( port.id===finalOutputPort.id){
                    console.log("found final output port",port)
                     return {
                      ...port,
                      value:outputValue
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

        drawCanvas(canvas,inputPorts,outputPorts,gates,connections)
    }

    const clearConnections=()=>{
      setConnections([])
      handleBoardPositioning()
    }
    useEffect(()=>{
      drawCanvasHandler()
      console.log(connections)
    },[inputPorts,connections,selectedPort])

    useEffect(()=>{
      handleResize()
    },[])
    useEffect(() => {
     
        handleBoardPositioning()
      if(canvasRef.current){
        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')
        if(!ctx) return
        
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

const handleBoardPositioning=()=>{
  if(canvasResolution){
    const { adjustedPorts, adjustedGates,adjustedOutPutPorts } = adjustPositions(canvasResolution.width, canvasResolution.height)
  setInputPorts(adjustedPorts)
  setOutputPorts(adjustedOutPutPorts)
  setGates(adjustedGates)
  }
}
  return (
    <div
    className='flex flex-col items-center justify-center relative  '
    >
      
      <button onClick={clearConnections} className='absolute right-5 top-0'>Clear</button>
      
        <canvas

        ref={canvasRef}
        onClick={handleClickEvent}
        
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className='border border-black flex-1 bg-[url("/backgroundGrid.png")] '
        width={canvasResolution?.width}
        height={canvasResolution?.height}
        />
    </div>
  )
}

export default GatePage