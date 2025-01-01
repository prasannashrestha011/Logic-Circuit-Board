import { Point } from "@/app/gate/types";

export function generateGatePosition():Point{
    const randomX = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
    const randomY = Math.floor(Math.random() * (100 - 100 + 1)) + 100;
    return {x:randomX,y:randomY}
}