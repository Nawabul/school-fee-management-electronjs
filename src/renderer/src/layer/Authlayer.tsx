import Sidebar from '@renderer/components/drawer/Sidebar'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

const Authlayer = (): React.ReactElement => {
  const [height, setHeight] = useState(window.innerHeight)

  const location = useLocation();
  console.log('Current location:', location);
  useEffect(() => {
    const handleResize = ():void => setHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="dark:bg-gray-900 p-1 pr-0 md:pr-1">
      <div className="flex dark:text-white pt-1">
        <Sidebar />
        <div className="flex-1 md:pl-2 pr-1 overflow-auto" style={{ height: height }}>
          <div className="dark:bg-gray-800 rounded-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authlayer
