import { Checkbox, Tag, Collapse, Empty } from "antd";

import { CalendarOutlined, StarFilled } from "@ant-design/icons";

import type { Task } from "../../types/task";

type Props = {
  data: Task[];
  loading: boolean;
};

export default function TaskGrid({ data, loading }: Props) {
  const activeTasks = data.filter((task) => !task.completed);

  const completedTasks = data.filter((task) => task.completed);

  const TaskRow = ({ task }: { task: Task }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 42,
        padding: "0 16px",
        borderBottom: "1px solid #f0f0f0",
        fontSize: 14,
      }}
    >
      {/* checkbox */}

      <div
        style={{
          width: 50,
        }}
      >
        <Checkbox checked={task.completed} />
      </div>

      {/* title */}

      <div
        style={{
          flex: 1,
        }}
      >
        {task.title}
      </div>

      {/* due date */}

      <div
        style={{
          width: 180,
          color: "#666",
        }}
      >
        <CalendarOutlined /> {task.dueDate}
      </div>

      {/* importance */}

      <div
        style={{
          width: 120,
        }}
      >
        {task.priority === "HIGH" ? (
          <Tag color="red">
            <StarFilled />
            High
          </Tag>
        ) : task.priority === "MEDIUM" ? (
          <Tag color="orange">Medium</Tag>
        ) : (
          <Tag>Low</Tag>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}

      <div
        style={{
          display: "flex",
          height: 36,
          alignItems: "center",
          padding: "0 16px",
          background: "#faf9f8",
          color: "#605e5c",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <div
          style={{
            width: 50,
          }}
        />

        <div
          style={{
            flex: 1,
          }}
        >
          Title
        </div>

        <div
          style={{
            width: 180,
          }}
        >
          Due date
        </div>

        <div
          style={{
            width: 120,
          }}
        >
          Importance
        </div>
      </div>

      {/* Data */}

      {activeTasks.length ? (
        activeTasks.map((task) => <TaskRow key={task.id} task={task} />)
      ) : (
        <Empty />
      )}

      {/* Completed */}

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
                <TaskRow key={task.id} task={task} />
              )),
            },
          ]}
        />
      )}
    </div>
  );
}
