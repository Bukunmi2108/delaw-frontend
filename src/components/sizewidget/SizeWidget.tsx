import React from 'react';
import './SizeWidget.css'

interface SizeWidgetProps {
  size: number
}

const SizeWidget: React.FC<SizeWidgetProps> = ({size}) => {
  return (
    <div className='size-widget'>
      {size}
    </div>
  )
}

export default SizeWidget;