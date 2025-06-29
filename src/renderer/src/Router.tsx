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
import MisItemRecord from './pages/mis_item/MisItemRecord'
import MisItemInsert from './pages/mis_item/MisItemInsert'
import MisItemUpdate from './pages/mis_item/MisItemUpdate'
import MisChargeRecord from './pages/mis_charge/MisChargeRecord'
import MisChargeInsert from './pages/mis_charge/MisChargeInsert'
import MisChargeUpdate from './pages/mis_charge/MisChargeUpdate'
import MonthlyFeeRecord from './pages/monthly_fee/MonthlyFeeRecord'
import StudentTransfer from './pages/student/StudentTransfer'
import AdmissionRecord from './pages/admission/AdmissionRecord'
import AdmissionInsert from './pages/admission/AdmissionInsert'

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
              },
              {
                path: 'transfer/:id',
                element: <StudentTransfer />
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
          // mis charge
          {
            path: 'mis_charge',
            children: [
              {
                path: ':id',
                element: <MisChargeRecord />
              },
              {
                path: 'insert/:id',
                element: <MisChargeInsert />
              },
              {
                path: 'update/:id',
                element: <MisChargeUpdate />
              }
            ]
          },
          // montly fee
          {
            path: 'monthly_fee',
            children: [
              {
                path: ':id',
                element: <MonthlyFeeRecord />
              }
            ]
          },

          // admission
          {
            path: 'admission',
            children: [
              {
                path: ':id',
                element: <AdmissionRecord />
              },
              {
                path: 'insert/:id',
                element: <AdmissionInsert />
              },

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
          },
          // mis items
          {
            path: 'mis_item',
            children: [
              {
                path: '',
                element: <MisItemRecord />
              },
              {
                path: 'insert',
                element: <MisItemInsert />
              },
              {
                path: 'update/:id',
                element: <MisItemUpdate />
              }
            ]
          }
        ]
      }
    ])}
  />
)

export default Router
