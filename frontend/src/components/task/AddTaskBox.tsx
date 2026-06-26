import { Input, Button, Space } from "antd";

import {
  BorderOutlined,
  CalendarOutlined,
  BellOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { useState } from "react";

type Props = {
  onAdd?: (title: string) => void;
};

export default function AddTaskBox({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    onAdd?.(title);

    setTitle("");
  };

  return (
    <div
      style={{
        background: "#fff",

        borderRadius: 4,

        border: "1px solid #edebe9",

        overflow: "hidden",

        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems: "center",

          padding: "12px 16px",

          borderBottom: "1px solid #edebe9",
        }}
      >
        <BorderOutlined
          style={{
            color: "#2564cf",

            marginRight: 16,

            fontSize: 18,
          }}
        />

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={handleAdd}
          placeholder="Add a task"
          bordered={false}
        />
      </div>

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          padding: "8px 16px",

          background: "#faf9f8",
        }}
      >
        <Space>
          <Button type="text" icon={<CalendarOutlined />} />

          <Button type="text" icon={<BellOutlined />} />

          <Button type="text" icon={<SyncOutlined />} />
        </Space>

        <Button size="small" disabled={!title.trim()} onClick={handleAdd}>
          Add
        </Button>
      </div>
    </div>
  );
}
