import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { Button } from "antd";

export default function SidebarHeader({ collapsed, setCollapsed }) {
  return (
    <div
      className="
      h-14
      flex
      items-center
      justify-between
      px-8!
      border-b
      border-(--border)
      "
    >
      {!collapsed && (
        <span
          className="
          font-semibold
          text-lg
          text-(--text-main)
          "
        ></span>
      )}

      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
    </div>
  );
}
