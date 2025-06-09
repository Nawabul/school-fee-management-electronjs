import { createContext, useState, useContext, ReactNode, JSX } from 'react'
import { Student_Record } from '@renderer/types/ts/student'
// Define the shape of the context
interface StudentDetailsContextType {
  studentDetails: Student_Record | null
  setStudentDetails: (details: Student_Record) => void
}

// Create the context with default value
const StudentDetailsContext = createContext<StudentDetailsContextType | null>(null)

// Define the provider component
export const StudentDetailsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [studentDetails, setStudentDetails] = useState<Student_Record | null>(null)

  const setStudentDetialsHandler = (data: Student_Record): void => {
    setStudentDetails(data)
  }

  return (
    <StudentDetailsContext.Provider
      value={{ studentDetails, setStudentDetails: setStudentDetialsHandler }}
    >
      {children}
    </StudentDetailsContext.Provider>
  )
}

// Custom hook to consume the context
const useStudentDetails = (): StudentDetailsContextType => {
  const context = useContext(StudentDetailsContext)
  if (!context) {
    throw new Error('Student provider error')
  }
  return context
}
// @ts-ignore no need to seprate file
export default useStudentDetails
