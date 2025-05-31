import {
  Sidebar as Side,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems
} from 'flowbite-react'
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'
import { HiChartPie, HiInbox, HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi'
import { MdManageAccounts } from 'react-icons/md'
import { Link } from 'react-router-dom'

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
          <SidebarCollapse
            icon={MdManageAccounts}
            label="Manage Staff"
            renderChevronIcon={(theme, open) => {
              const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm

              return (
                <IconComponent
                  aria-hidden
                  className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])}
                />
              )
            }}
          >
            <SidebarItem as={Link} to="/student/record" icon={HiInbox}>
              All Students
            </SidebarItem>
            <SidebarItem as={Link} to="/student/add" icon={HiInbox}>
              Add Student
            </SidebarItem>
            <SidebarItem as={Link} to="/student/payment" icon={HiInbox}>
              Fees Payment
            </SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Side>
  )
}

export default Sidebar
