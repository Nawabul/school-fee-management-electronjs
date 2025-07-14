import React from 'react'

interface data {
  name: string
  value: number
}

interface FeeChartProps {
  chartData: data[]
  className?: string
}

const FeeChart = ({ chartData,className }: FeeChartProps): React.JSX.Element => {
  const maxValue = Math.max(...chartData.map((d) => d.value))
  const totalRevenue = chartData.reduce((acc, cur) => acc + cur.value, 0)

  return (
    <div className={`bg-slate-800 p-6 rounded-xl shadow-lg ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Fee Collection Overview</h3>
          <p className="text-sm text-slate-400">
            Total Revenue This Year:{' '}
            <span className="font-bold text-green-400">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </p>
        </div>
      </div>
      <div className="h-80 w-full">
        <svg width="100%" height="100%" viewBox="0 0 500 300">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick} className="text-slate-500">
              <line
                x1="30"
                x2="490"
                y1={250 - tick * 220}
                y2={250 - tick * 220}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              <text x="25" y={255 - tick * 220} textAnchor="end" fontSize="10" fill="currentColor">
                {(maxValue * tick) / 1000}k
              </text>
            </g>
          ))}
          <line x1="30" y1="250" x2="490" y2="250" stroke="#475569" strokeWidth="1" />
          {chartData.map((d, i) => {
            const barHeight = (d.value / maxValue) * 220
            const xPos = 40 + i * 38
            return (
              <g key={d.name} className="group">
                <rect
                  x={xPos}
                  y={250 - barHeight}
                  width="20"
                  height={barHeight}
                  fill="#2563eb"
                  className="transition-all duration-200 group-hover:fill-blue-400"
                  rx="2"
                />
                <text x={xPos + 10} y="265" textAnchor="middle" fontSize="10" fill="#94a3b8">
                  {d.name}
                </text>
                <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <rect
                    x={xPos - 15}
                    y={220 - barHeight}
                    width="50"
                    height="20"
                    rx="4"
                    fill="#1e293b"
                    stroke="#334155"
                  />
                  <text
                    x={xPos + 10}
                    y={234 - barHeight}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#ffffff"
                    fontWeight="bold"
                  >
                    ₹{d.value / 1000}k
                  </text>
                </g>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
export default FeeChart
