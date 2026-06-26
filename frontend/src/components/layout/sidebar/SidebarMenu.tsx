import {
  SunOutlined,
  StarOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { Menu } from "antd";

import type { MenuProps } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

export default function SidebarMenu() {
  const navigate = useNavigate();

  const location = useLocation();

  const items: MenuProps["items"] = [
    {
      key: "/my-day",
      icon: <SunOutlined className="text-[var(--primary)]" />,
      label: "My Day",
    },

    {
      key: "/important",
      icon: <StarOutlined className="text-[var(--task-important)]" />,
      label: "Important",
    },

    {
      key: "/planned",
      icon: <CalendarOutlined />,
      label: "Planned",
    },

    {
      key: "/assigned",
      icon: <UserOutlined />,
      label: "Assigned to me",
    },

    {
      key: "/tasks",
      icon: <HomeOutlined />,
      label: "Tasks",
    },

    // Divider đúng type
    {
      type: "divider",
    },

    {
      key: "lists",
      label: "My Lists",

      children: [
        {
          key: "/personal",
          label: "Personal",
        },

        {
          key: "/work",
          label: "Work",
        },

        {
          key: "create-list",
          icon: <PlusOutlined />,
          label: "Create list",
        },
      ],
    },
  ];

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[location.pathname]}
      onClick={(e) => {
        if (e.key.startsWith("/")) {
          navigate(e.key);
        }
      }}
      className="
        bg-transparent!
        border-none
        px-2
      "
    />
  );
}
