import { Input, Button, Space } from "antd";

import {
  SunOutlined,
  SwapOutlined,
  AppstoreAddOutlined,
  BulbOutlined,
  BorderOutlined,
  CalendarOutlined,
  BellOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { useState } from "react";

import TaskGrid from "../components/task/TaskGrid";
import TaskList from "../components/task/TaskList";

import PageHeader from "../components/common/PageHeader";

import { useAppSelector } from "../hooks/useAppSelector";

import { selectTasks } from "../redux/task/taskSelector";
import AddTaskBox from "../components/task/AddTaskBox";

export const MyDayPage = () => {
  const tasks = useAppSelector(selectTasks);

  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  return (
    <div
      style={{
        height: "100%",

        display: "flex",

        flexDirection: "column",
      }}
    >
      {/* Header */}

      <PageHeader
        icon={
          <SunOutlined
            style={{
              fontSize: 24,

              color: "#2564cf",
            }}
          />
        }
        title="My Day"
        subtitle="Friday, June 26"
        viewMode={viewMode}
        setViewMode={setViewMode}
        actions={
          <>
            <Button type="text" icon={<SwapOutlined />}>
              Sort
            </Button>

            <Button type="text" icon={<AppstoreAddOutlined />}>
              Group
            </Button>

            <Button type="text" icon={<BulbOutlined />}>
              Suggestions
            </Button>
          </>
        }
      />

      {/* Add task */}

      <AddTaskBox
        onAdd={(title) => {
          console.log(title);
        }}
      />

      {/* Content */}

      <div
        style={{
          flex: 1,

          overflowY: "auto",
        }}
      >
        {viewMode === "grid" ? (
          <TaskGrid data={tasks} loading={false} />
        ) : (
          <TaskList data={tasks} loading={false} />
        )}
      </div>
    </div>
  );
};
