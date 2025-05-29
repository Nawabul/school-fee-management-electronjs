

import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";


export function Authenticated() {
  return (
    <Sidebar aria-label="Default sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="#" icon={HiViewBoards} label="Pro" labelColor="dark">
            Kanban
          </SidebarItem>

        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
