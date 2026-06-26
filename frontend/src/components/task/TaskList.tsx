import { Checkbox, Tag, Collapse, Empty } from "antd";

import { CalendarOutlined, StarFilled } from "@ant-design/icons";

import type { Task } from "../../types/task";

type Props = {
  data: Task[];
  loading: boolean;
};

export default function TaskList({ data }: Props) {
  const activeTasks = data.filter((task) => !task.completed);

  const completedTasks = data.filter((task) => task.completed);

  const TaskItem = ({ task }: { task: Task }) => (
    <div
      style={{
        display: "flex",

        alignItems: "center",

        background: "#fff",

        border: "1px solid #edebe9",

        borderRadius: 6,

        height: 44,

        padding: "0 14px",

        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 40,
        }}
      >
        <Checkbox checked={task.completed} />
      </div>

      <div
        style={{
          flex: 1,

          fontSize: 14,
        }}
      >
        {task.title}
      </div>

      <div
        style={{
          width: 160,

          fontSize: 13,

          color: "#666",
        }}
      >
        <CalendarOutlined /> {task.dueDate}
      </div>

      <div
        style={{
          width: 120,
        }}
      >
        <Tag
          bordered={false}
          color={
            task.priority === "HIGH"
              ? "red"
              : task.priority === "MEDIUM"
                ? "orange"
                : "green"
          }
        >
          {task.priority === "HIGH" && <StarFilled />}

          {task.priority}
        </Tag>
      </div>
    </div>
  );

  return (
    <div>
      {activeTasks.length > 0 ? (
        activeTasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <Empty />
      )}

      {completedTasks.length > 0 && (
        <Collapse
          ghost
          style={{
            marginTop: 12,
          }}
          items={[
            {
              key: "completed",

              label: `Completed (${completedTasks.length})`,

              children: completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              )),
            },
          ]}
        />
      )}
    </div>
  );
}
