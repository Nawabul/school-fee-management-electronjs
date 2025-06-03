import { Sidebar as Side, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiChartPie } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

const Sidebar = (): React.JSX.Element => {
  const [height, setHeight] = useState(window.innerHeight - 15)

  useEffect(() => {
    const handleResize = (): void => setHeight(window.innerHeight - 15)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Side
      collapsed={true}
      aria-label="dashboard sidebar"
      style={{ height: height }}
      className={`relative xs:w-fit transition-all duration-200 my-cus`}
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem as={Link} href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          {/* @ts-ignore */}
          <SidebarItem as={Link} to="class" icon={HiChartPie}>
            Class
          </SidebarItem>
          {/* @ts-ignore */}
          <SidebarItem as={Link} to="student" icon={User}>
            Student
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Side>
  )
}

export default Sidebar
