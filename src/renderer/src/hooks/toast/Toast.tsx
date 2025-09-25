import { ToastType } from '@renderer/types/ts/toast'
import React from 'react'

interface ToastProps {
  message: string
  type: ToastType
  onDismiss: () => void
}

// These are simple inline SVGs for the icons.
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactNode => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const ExclamationCircleIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.119 3.375 1.832 3.375h14.466c1.713 0 2.698-1.875 1.832-3.375l-7.252-12.552a1.875 1.875 0 00-3.264 0l-7.252 12.552z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h.008v.008H12z" />
  </svg>
)

const XMarkIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const isError = type === 'error'
  const iconColor = isError ? 'text-red-600' : 'text-green-600'
  const IconComponent = isError ? ExclamationCircleIcon : CheckCircleIcon

  return (
    <div
      className={`
        flex items-center gap-x-3
        min-w-[300px] max-w-sm p-4 rounded-xl
        bg-white text-gray-800 font-medium
        shadow-xl
        animate-fade-in-up
      `}
      role="alert"
    >
      {/* Status Icon */}
      <IconComponent className={`w-6 h-6 flex-shrink-0 ${iconColor}`} />

      {/* Message Content */}
      <div className="flex-grow">
        <p className="text-sm font-bold capitalize">{type}</p>
        <p className="text-sm">{message}</p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="Close"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
