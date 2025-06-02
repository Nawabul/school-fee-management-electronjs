import { RouterProvider, createHashRouter } from 'react-router-dom'
import Authlayer from './layer/Authlayer'
import Home from './pages/Home'
import { StudentInsert, StudentRecord } from './pages/student'
import ClassInsert from './pages/class/ClassInsert'
import ClassRecord from './pages/class/ClassRecord'
import ClassUpdate from './pages/class/ClassUpdate'

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
          },
          // class
          {
            path: 'class',
            children: [
              {
                path: '',
                element: <ClassRecord />
              },
              {
                path: 'insert',
                element: <ClassInsert />
              },
              {
                path: 'update/:id',
                element: <ClassUpdate />
              }
            ]
          }
        ]
      }
    ])}
  />
)

export default Router
