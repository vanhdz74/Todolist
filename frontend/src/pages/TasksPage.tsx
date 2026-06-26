import { Typography, Button, Space, Card, Segmented } from "antd";

import {
  CheckSquareOutlined,
  SortAscendingOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

import { selectLoading, selectTasks } from "../redux/task/taskSelector";

import { getTasksRequest } from "../redux/task/taskSlice";

import TaskGrid from "../components/task/TaskGrid";
import TaskList from "../components/task/TaskList";
import AddTaskBox from "../components/task/AddTaskBox";

const { Title, Text } = Typography;

export const TasksPage = () => {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector(selectTasks);

  const loading = useAppSelector(selectLoading);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    dispatch(getTasksRequest());
  }, [dispatch]);

  return (
    <div
      style={{
        height: "100%",

        display: "flex",

        flexDirection: "column",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 12,
            }}
          >
            <Title
              level={3}
              style={{
                margin: 0,

                display: "flex",

                alignItems: "center",

                gap: 8,
              }}
            >
              <CheckSquareOutlined
                style={{
                  color: "#2564cf",
                }}
              />
              Tasks
              <span
                style={{
                  color: "#8c8c8c",

                  fontSize: 20,
                }}
              >
                ...
              </span>
            </Title>

            <Segmented
              size="small"
              value={viewMode}
              onChange={(value) => setViewMode(value as "grid" | "list")}
              options={[
                {
                  label: "Grid",
                  value: "grid",
                  icon: <AppstoreOutlined />,
                },

                {
                  label: "List",
                  value: "list",
                  icon: <BarsOutlined />,
                },
              ]}
            />
          </div>

          <Text
            style={{
              color: "#605e5c",

              fontSize: 12,
            }}
          >
            Manage your tasks
          </Text>
        </div>

        <Space>
          <Button type="text" icon={<SortAscendingOutlined />}>
            Sort
          </Button>

          <Button type="text" icon={<AppstoreAddOutlined />}>
            Group
          </Button>
        </Space>
      </div>

      <AddTaskBox />

      <Card
        style={{
          borderRadius: 8,

          flex: 1,

          overflow: "auto",
        }}
        bodyStyle={{
          padding: 16,
        }}
      >
        {viewMode === "grid" ? (
          <TaskGrid data={tasks} loading={loading} />
        ) : (
          <TaskList data={tasks} loading={loading} />
        )}
      </Card>
    </div>
  );
};
