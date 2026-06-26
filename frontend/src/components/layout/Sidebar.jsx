import { Layout } from "antd";
import { useState } from "react";

import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarMenu from "./sidebar/SidebarMenu";
import SidebarFooter from "./sidebar/SidebarFooter";

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      width={300}
      collapsedWidth={80}
      collapsed={collapsed}
      theme="light"
      className="
        bg-(--bg-sidebar)!
        border-r
        border-(--border)
      "
    >
      <div
        className="
          h-full
          flex
          flex-col
        "
      >
        <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <div
          className="
            flex-1
            overflow-auto
          "
        >
          <SidebarMenu collapsed={collapsed} />
        </div>

        <SidebarFooter collapsed={collapsed} />
      </div>
    </Sider>
  );
}
