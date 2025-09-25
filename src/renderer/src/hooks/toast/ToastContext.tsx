// ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from './Toast'
import { ToastContextType, ToastMessage, ToastType } from '@renderer/types/ts/toast'

const ToastContext = createContext<ToastContextType | null>(null)

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (message: string, type: ToastType = 'success'): void => {
    const id = Date.now()
    setToasts((currentToasts) => [...currentToasts, { id, message, type }])

    // Auto-dismiss the toast after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: number): void => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-16 right-5 z-50 flex flex-col-reverse items-end space-y-3 space-y-reverse">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default useToast
