import FeeChart from '@renderer/components/dashboard/FeeChart'
import Header from '@renderer/components/Header'
import { Users, DollarSign, Shapes, LayoutDashboard, History } from 'lucide-react'

function Home(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

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
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-6"
            >
              <div className={`p-3 rounded-full bg-slate-700 ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-slate-400 text-md">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:flex gap-5 space-y-5">
          <FeeChart chartData={chartData} className="flex-1" />
          <div className="bg-slate-800 h-fit p-6 rounded-xl shadow-lg">
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

// Mock Data
const stats = [
  {
    title: 'Total Students',
    value: '1,250',
    icon: <Users className="w-8 h-8" />,
    color: 'text-blue-400'
  },
  {
    title: 'Total Classes',
    value: '18',
    icon: <Shapes className="w-8 h-8" />,
    color: 'text-blue-400'
  },
  {
    title: 'Fees Collected (Today)',
    value: '₹45,600',
    icon: <DollarSign className="w-8 h-8" />,
    color: 'text-green-400'
  },
  {
    title: 'Fees Collected (Monthly)',
    value: '₹45,600',
    icon: <DollarSign className="w-8 h-8" />,
    color: 'text-green-400'
  },
  {
    title: 'Pending Fees',
    value: '₹1,20,500',
    icon: <DollarSign className="w-8 h-8" />,
    color: 'text-red-400'
  },
  {
    title: 'Fees Collected (Yearly)',
    value: '85',
    icon: <DollarSign className="w-8 h-8" />,
    color: 'text-yellow-400'
  }
]

const recentActivities = [
  { name: 'Priya Sharma', action: 'paid ₹1500 for June fees.', time: '2 mins ago' },
  { name: 'New Student', action: 'Ankit Verma admitted to Class 10.', time: '15 mins ago' },
  { name: 'Rohan Gupta', action: 'paid ₹500 for exam fees.', time: '1 hour ago' },
  { name: 'Staff Update', action: 'New science teacher, Mrs. Kavita, joined.', time: '3 hours ago' }
]

const chartData = [
  { name: 'Jan', value: 120000 },
  { name: 'Feb', value: 150000 },
  { name: 'Mar', value: 100000 },
  { name: 'Apr', value: 170000 },
  { name: 'May', value: 180000 },
  { name: 'Jun', value: 190000 },
  { name: 'Jul', value: 140000 },
  { name: 'Aug', value: 160000 },
  { name: 'Sep', value: 130000 },
  { name: 'Oct', value: 200000 },
  { name: 'Nov', value: 220000 },
  { name: 'Dec', value: 180000 }
]
