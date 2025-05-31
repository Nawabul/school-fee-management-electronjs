import { RouterProvider, createHashRouter } from 'react-router-dom'
import Authlayer from './layer/Authlayer'
import Home from './pages/Home'
import StudentRecord from './pages/student/StudentRecord'

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
              }
            ]
          }
        ]
      }
    ])}
  />
)

export default Router
