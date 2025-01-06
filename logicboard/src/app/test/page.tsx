"use client"
import { useRef, useState, useEffect } from 'react';

const DraggableShape: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shape, setShape] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  });
  const isDraggingRef = useRef(false); // To track dragging state
  const offsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  // Function to draw the rectangle
  const drawShape = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    context.fillStyle = 'blue';
    context.fillRect(shape.x, shape.y, shape.width, shape.height);
  };

  // Event listeners for mouse down, move, and up
  const handleMouseDown = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if mouse is inside the rectangle
    if (
      mouseX >= shape.x &&
      mouseX <= shape.x + shape.width &&
      mouseY >= shape.y &&
      mouseY <= shape.y + shape.height
    ) {
      isDraggingRef.current = true;
      offsetRef.current = { offsetX: mouseX - shape.x, offsetY: mouseY - shape.y };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setShape((prevShape) => ({
      ...prevShape,
      x: mouseX - offsetRef.current.offsetX,
      y: mouseY - offsetRef.current.offsetY,
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    drawShape();
  }, [shape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp); // To stop dragging when mouse leaves canvas

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [shape]);

  return <canvas ref={canvasRef} width={600} height={400} style={{ border: '1px solid black' }} />;
};

export default DraggableShape;
