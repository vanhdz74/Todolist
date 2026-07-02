import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { Button } from "antd";

type Props = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export default function SidebarHeader({ collapsed, setCollapsed }: Props) {
  return (
    <div
      className={`
        h-14
        flex
        items-center
        px-4!
        border-b
        border-(--border)

        ${collapsed ? "justify-center" : "justify-between"}
      `}
    >
      {!collapsed && (
        <span
          className="
            font-semibold
            text-lg
            text-(--text-main)
            ml-4!
          "
        ></span>
      )}

      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="
          flex!
          items-center!
          justify-center!
          text-(--text-main)!
          hover:bg-(--bg-hover)!
          focus:bg-(--bg-hover)!
        "
      />
    </div>
  );
}
