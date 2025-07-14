import { createContext, useState, useContext, ReactNode, JSX } from 'react'
// Define the shape of the context
interface setProps {
  title?: string | null
  description?: string | null
  submitTitle?: string
  closeTitle?: string
  closeable?: boolean
  showSubmitBtn?: boolean
  component?: React.ReactNode | null
  componentOnly?: boolean
  submitFun?: () => void
  closeFun?: () => void
}
type props = {
  title: string | null
  description: string | null
  submitTitle: string
  closeTitle: string
  closeable: boolean
  showSubmitBtn: boolean
  component: React.ReactNode | null
  componentOnly: boolean
  submitFun: () => void
  closeFun: () => void
  show: boolean
}
interface ModelContextType {
  content: props
  openModel: (data: setProps) => void
  closeModel: () => void
}

// Create the context with default value
const ModelContext = createContext<ModelContextType | null>(null)

// Define the provider component
export const ModelProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const notShow = {
    show: false,
    submitTitle: 'Yes, Delete',
    closeTitle: 'No, Keep it',
    closeable: true,
    component: null,
    componentOnly: false,
    submitFun: () => {},
    closeFun: () => {},
    showSubmitBtn: true,
    title: null,
    description: 'Are you sure you want to delete this ? '
  }
  const [content, setContent] = useState<props>(notShow)

  const openModelHandler = ({
    title = null,
    description = 'Are you sure you want to delete this ? ',
    showSubmitBtn = true,
    submitTitle = 'Yes, Delete',
    closeTitle = 'No, Keep it',
    closeable = true,
    component = null,
    componentOnly = false,
    submitFun = () => {},
    closeFun = () => {}
  }: setProps): void => {
    setContent({
      title,
      description,
      submitTitle,
      closeTitle,
      closeable,
      component,
      componentOnly,
      submitFun,
      showSubmitBtn,
      closeFun,
      show: true
    })
  }
  const closeModelHandler = (): void => {
    setContent({
      show: false,
      submitTitle: 'Yes, Delete',
      closeTitle: 'No, Keep it',
      closeable: true,
      component: null,
      componentOnly: false,
      submitFun: () => {},
      closeFun: () => {},
      showSubmitBtn: true,
      title: null,
      description:'Are you sure you want to delete this ? '
    })
  }

  return (
    <ModelContext.Provider
      value={{ content, openModel: openModelHandler, closeModel: closeModelHandler }}
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
