import Sidebar from '@renderer/components/drawer/Sidebar'
import Model from '@renderer/components/model/Model'
import SessionEndSet from '@renderer/components/session/SessionEndSet'
import TitleBar from '@renderer/components/titleBar/TitleBar'
import InitController from '@renderer/controller/InitController'
import SessionController from '@renderer/controller/SessionController'
import useModel from '@renderer/hooks/useModel'
import { StudentDetailsProvider } from '@renderer/hooks/useStudentDetails'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

const Authlayer = (): React.ReactElement => {
  const [height, setHeight] = useState(window.innerHeight)
  const [completed, setCompleted] = useState<{ status: boolean; message: string }>({
    status: false,
    message: 'Please wait app is being tested'
  })
  const { openModel, closeModel } = useModel()

  useEffect(() => {
    const handleResize = (): void => setHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // setip
  useEffect(function init() {
    type step = {
      fun: () => Promise<boolean>
      message: string
    }
    const container: step[] = [
      {
        fun: InitController.database,
        message: 'Database connection failed'
      },
      {
        fun: async function (): Promise<boolean> {
          // check session is set or not
          const session = await SessionController.check()

          if (session) {
            return true
          }
          const set = new Promise<boolean>((resolve) => {
            const completed = (): void => {
              resolve(true)
              closeModel()
            }
            openModel({
              title: 'Session Expired',
              description:
                'Month will be considered as end month of the student who are stil studing',
              closeable: false,
              showSubmitBtn: false,
              component: <SessionEndSet sumbitFun={completed} />
            })
          })
          const result = await set
          return result
        },
        message: 'Session Expired setup failed'
      },
      {
        fun: InitController.monthly_fee,
        message: 'Monthly fee setup failed'
      }
    ]

    function* sequence(): Generator<step> {
      for (let i = 0; i < container.length; i++) {
        yield container[i]
      }
    }
    ;(async () => {
      const steps = sequence()
      let done = false
      while (!done) {
        const step = steps.next()

        try {
          if (step.done) {
            done = true
            setCompleted({ status: true, message: 'Initialization completed' })
            break
          }
          const result = await step.value.fun()

          if (result === false) {
            // Stop if function returned false
            setCompleted({ status: false, message: step.value.message })
            return
          }
        } catch (e) {

          setCompleted({ status: false, message: step.value.message })
          return
        }
      }
      // success

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
      <TitleBar />
      <div className="dark:bg-gray-900 p-1 pr-0 pt-10 md:pr-1">
        <Model />
        <div className="flex dark:text-white pt-1">
          <Sidebar />
          <div className="flex-1 md:pl-2 pr-1 overflow-auto pb-4" style={{ height: height }}>
            <div className="rounded-xl">
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
