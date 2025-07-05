import { createContext, useState, useContext, ReactNode, JSX } from 'react'
// Define the shape of the context
type setAlert = {
  fun: () => void
}
interface ModelContextType {
  alert: { fun: () => void } | null
  openModel: (data: setAlert) => void
  closeModel: () => void
}

// Create the context with default value
const ModelContext = createContext<ModelContextType | null>(null)

// Define the provider component
export const ModelProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [alert, setAlert] = useState<setAlert | null>(null)

  const openModelHandler = (data: setAlert): void => {
    setAlert(data)
  }
  const closeModelHandler = (): void => {
    setAlert(null)
  }

  return (
    <ModelContext.Provider
      value={{ alert, openModel: openModelHandler, closeModel: closeModelHandler }}
    >
      {children}
    </ModelContext.Provider>
  )
}

// Custom hook to consume the context
const useModel = (): ModelContextType => {
  const context = useContext(ModelContext)
  if (!context) {
    throw new Error('Model provider error')
  }
  return context
}
// @ts-ignore no need to seprate file
export default useModel
