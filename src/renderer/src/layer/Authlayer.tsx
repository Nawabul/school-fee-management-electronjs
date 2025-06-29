import Sidebar from '@renderer/components/drawer/Sidebar'
import InitController from '@renderer/controller/InitController'
import { StudentDetailsProvider } from '@renderer/hooks/useStudentDetails'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

const Authlayer = (): React.ReactElement => {
  const [height, setHeight] = useState(window.innerHeight)
  const [completed, setCompleted] = useState<{ status: boolean; message: string }>({
    status: false,
    message: 'Please wait app is being tested'
  })

  useEffect(() => {
    const handleResize = (): void => setHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // setip
  useEffect(function init() {
    ;(async () => {
      // databse handler
      const db = await InitController.database()
      if (!db) {
        setCompleted({ status: false, message: 'Database connection failed' })
      }

      // monthly fee
      const monthlyFee = await InitController.monthly_fee()
      if (!monthlyFee) {
        setCompleted({ status: false, message: 'Monthly fee Calculation failed' })
      }

      // success
      setCompleted({ status: true, message: 'Initialization completed' })

      // check for app update
      if (navigator.onLine) {
        InitController.app_update()
      } else {
        window.addEventListener('online', () => {

          InitController.app_update()
        })
      }
    })()
  }, [])

  return (
    <StudentDetailsProvider>
      <div className="dark:bg-gray-900 p-1 pr-0 md:pr-1">
        <div className="flex dark:text-white pt-1">
          <Sidebar />
          <div className="flex-1 md:pl-2 pr-1 overflow-auto" style={{ height: height }}>
            <div className="dark:bg-gray-800 rounded-xl">
              {!completed.status && <span> {completed.message} </span>}
              {completed.status && <Outlet />}
            </div>
          </div>
        </div>
      </div>
    </StudentDetailsProvider>
  )
}

export default Authlayer
