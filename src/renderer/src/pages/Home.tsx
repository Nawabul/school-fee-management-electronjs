import FeeChart from '@renderer/components/dashboard/FeeChart'
import Header from '@renderer/components/Header'
import DashbaordController from '@renderer/controller/DashbaordController'
import { queryKey } from '@renderer/types/constant/queryKey'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  LayoutDashboard,
  UserCheck,
  PiggyBank,
  Receipt,
  AlertTriangle,
  BookOpen,
  Package
} from 'lucide-react'
import { useMemo } from 'react'

function Home(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const { data, isSuccess } = useQuery({
    queryKey: queryKey.dashboard_statics,
    queryFn: DashbaordController.statics,
    refetchOnMount: true
  })

  // chart data =
  const { data: paymentChart = [] } = useQuery({
    queryKey: queryKey.dashboard_payment_chart,
    queryFn: DashbaordController.paymentChart,
    refetchOnMount: true
  })
  const statics = useMemo(() => {
    const stats = [
      {
        title: 'Total Students',
        value: data?.total_student || 0,
        icon: <Users className="w-8 h-8" />,
        color: 'text-blue-400'
      },
      {
        title: 'Active Students',
        value: data?.active_student || 0,
        icon: <UserCheck className="w-8 h-8" />,
        color: 'text-blue-600'
      },
      {
        title: 'Total Advance Paid',
        value: data?.total_advance || 0,
        icon: <PiggyBank className="w-8 h-8" />,
        color: 'text-green-600'
      },
      {
        title: 'Active Student Advance Paid',
        value: data?.active_advance || 0,
        icon: <Receipt className="w-8 h-8" />,
        color: 'text-green-700'
      },
      {
        title: 'Total Due Amount',
        value: data?.total_due || 0,
        icon: <AlertTriangle className="w-8 h-8" />,
        color: 'text-red-600'
      },
      {
        title: 'Active Student Due Amount',
        value: data?.active_due || 0,
        icon: <AlertTriangle className="w-8 h-8" />,
        color: 'text-red-700'
      },
      {
        title: 'Total Classes',
        value: data?.total_class || 0,
        icon: <BookOpen className="w-8 h-8" />,
        color: 'text-indigo-500'
      },
      {
        title: 'Total Mis. Items',
        value: data?.total_item || 0,
        icon: <Package className="w-8 h-8" />,
        color: 'text-purple-500'
      }
    ]

    return stats
  }, [isSuccess])
  return (
    <>
      <div className="p-5 space-y-5">
        <Header
          title="Dashboard"
          subtitle="Welcome to the School Fee Management System"
          icon={<LayoutDashboard size={45} />}
        />
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statics.map((stat) => (
            <div
              key={stat.title}
              className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-6"
            >
              <div className={`p-3 rounded-full bg-slate-700 ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-slate-400 text-md">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} `}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:flex gap-5 space-y-5">
          <FeeChart chartData={paymentChart} className="flex-1" />
          {/* <div className="bg-slate-800 h-fit p-6 rounded-xl shadow-lg">
            <div className="flex gap-2 items-center mb-4">
              <History size={20} />
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
             <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.action} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-bold text-white">{activity.name}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default Home

// const recentActivities = [
//   { name: 'Priya Sharma', action: 'paid ₹1500 for June fees.', time: '2 mins ago' },
//   { name: 'New Student', action: 'Ankit Verma admitted to Class 10.', time: '15 mins ago' },
//   { name: 'Rohan Gupta', action: 'paid ₹500 for exam fees.', time: '1 hour ago' },
//   { name: 'Staff Update', action: 'New science teacher, Mrs. Kavita, joined.', time: '3 hours ago' }
// ]

// const chartData = [
//   { name: 'Jan', value: 120000 },
//   { name: 'Feb', value: 150000 },
//   { name: 'Mar', value: 100000 },
//   { name: 'Apr', value: 170000 },
//   { name: 'May', value: 180000 },
//   { name: 'Jun', value: 190000 },
//   { name: 'Jul', value: 140000 },
//   { name: 'Aug', value: 160000 },
//   { name: 'Sep', value: 130000 },
//   { name: 'Oct', value: 200000 },
//   { name: 'Nov', value: 220000 },
//   { name: 'Dec', value: 180000 }
// ]
