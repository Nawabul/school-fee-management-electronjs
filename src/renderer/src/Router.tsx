import { RouterProvider, createHashRouter } from 'react-router-dom'
import Authlayer from './layer/Authlayer'
import Home from './pages/Home'
import { StudentInsert, StudentRecord } from './pages/student'

const Router = (): React.ReactElement => (
  <RouterProvider
    router={createHashRouter([
      {
        path: '/',
        element: <Authlayer />,
        children: [
          {
            path: '',
            element: <Home />
          },
          {
            path: 'student/',
            children: [
              {
                path: 'record',
                element: <StudentRecord />
              },
              {
                path: 'insert',
                element: <StudentInsert />
              }
            ]
          }
        ]
      }
    ])}
  />
)

export default Router
