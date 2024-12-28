import { Handle, Position } from '@xyflow/react'
import React from 'react'
interface Prop{
    data:{
        type:string,
    }
}
const NodeView:React.FC<Prop> = ({data}) => {
  return (
    <div className='border border-black w-fit'>
        <Handle
         id={`${data.type}-target`}
         position={Position.Left}
         type='target'
         />
        {data.type}
        <Handle
         id={`${data.type}-src`}
         position={Position.Right}
         type='source'
         />
    </div>
  )
}

export default NodeView