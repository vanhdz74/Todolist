import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { todoLists } from "@/constants/todoLists";
import { CURRENT_USER_ID } from "@/constants/user";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectIncompleteSmartListCounts,
  selectIncompleteTaskCountByListId,
  selectLoaded,
  selectLoading,
} from "@/redux/task/taskSelector";
import { getTasksRequest } from "@/redux/task/taskSlice";

import SidebarListGroups from "./SidebarListGroups";

type Props = {
  collapsed: boolean;
};

const renderLabel = (title: string, count?: number) => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <span className="min-w-0 truncate">{title}</span>

      {typeof count === "number" && count > 0 && (
        <span className="shrink-0 text-xs text-[var(--text-disabled)]">
          {count}
        </span>
      )}
    </div>
  );
};

// Menu chức năng có trong app
export default function SidebarMenu({ collapsed }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const taskLoaded = useAppSelector(selectLoaded);
  const taskLoading = useAppSelector(selectLoading);
  const smartListCounts = useAppSelector(selectIncompleteSmartListCounts);
  const countTaskByListId = useAppSelector(selectIncompleteTaskCountByListId);

  const smartLists = useMemo(
    () => todoLists.filter((list) => list.group === "smart"),
    [],
  );

  useEffect(() => {
    if (!taskLoaded && !taskLoading) {
      dispatch(getTasksRequest({ userId: CURRENT_USER_ID }));
    }
  }, [dispatch, taskLoaded, taskLoading]);

  const items: MenuProps["items"] = useMemo(() => {
    return smartLists.map((list) => {
      const count = smartListCounts[list.key] ?? 0;

      return {
        key: list.path,
        icon: <span className={list.accentClassName}>{list.icon}</span>,
        label: renderLabel(list.title, count),
      };
    });
  }, [smartLists, smartListCounts]);

  return (
    <>
      <Menu
        inlineCollapsed={collapsed}
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

      {!collapsed && <SidebarListGroups counts={countTaskByListId} />}
    </>
  );
}
