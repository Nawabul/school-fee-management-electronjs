import { RouterProvider, createHashRouter } from 'react-router-dom'
import Authlayer from './layer/Authlayer'
import Home from './pages/Home'
import { StudentInsert, StudentRecord } from './pages/student'
import ClassInsert from './pages/class/ClassInsert'
import ClassRecord from './pages/class/ClassRecord'
import ClassUpdate from './pages/class/ClassUpdate'
import StudentUpdate from './pages/student/StudentUpdate'
import PaymentRecord from './pages/payment/PaymentRecord'
import PaymentUpdate from './pages/payment/PaymentUpdate'
import PaymentInsert from './pages/payment/PaymentInsert'

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
                path: '',
                element: <StudentRecord />
              },
              {
                path: 'insert',
                element: <StudentInsert />
              },
              {
                path: 'update/:id',
                element: <StudentUpdate />
              }
            ]
          },
          // payment
          {
            path: 'payment',
            children: [
              {
                path: ':id',
                element: <PaymentRecord />
              },
              {
                path: 'insert/:id',
                element: <PaymentInsert />
              },
              {
                path: 'update/:id',
                element: <PaymentUpdate />
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
