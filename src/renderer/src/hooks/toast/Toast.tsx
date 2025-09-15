// Toast.tsx
import { ToastType } from '@renderer/types/ts/toast'
import React from 'react'

interface ToastProps {
  message: string
  type: ToastType
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500'
  const animation = 'animate-fade-in-up animate-fade-out'

  return (
    <div
      className={`
      py-3 px-6 rounded-lg text-white font-semibold shadow-lg
      transform transition-transform
      ${bgColor}
      ${animation}
    `}
    >
      {message}
    </div>
  )
}

export default Toast
