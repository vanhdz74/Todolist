import { PlusOutlined } from "@ant-design/icons";

import { Menu } from "antd";

import type { MenuProps } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

import { todoLists } from "@/constants/todoLists";

export default function SidebarMenu() {
  const navigate = useNavigate();

  const location = useLocation();

  const smartLists = todoLists.filter((list) => list.group === "smart");
  const customLists = todoLists.filter((list) => list.group === "custom");

  const items: MenuProps["items"] = [
    ...smartLists.map((list) => ({
      key: list.path,
      icon: (
        <span className={list.accentClassName}>
          {list.icon}
        </span>
      ),
      label: list.title,
    })),

    {
      type: "divider",
    },

    {
      key: "lists",
      label: "My Lists",
      children: [
        ...customLists.map((list) => ({
          key: list.path,
          icon: (
            <span className={list.accentClassName}>
              {list.icon}
            </span>
          ),
          label: list.title,
        })),
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
