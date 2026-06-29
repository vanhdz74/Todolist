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

  // Xử lý thêm task
  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd?.(title);
    setTitle("");
  };

  return (
    <div className="mb-4! overflow-hidden rounded border border-[#edebe9] bg-white">
      <div className="flex items-center border-b border-[#edebe9] px-4! py-3!">
        <BorderOutlined className="mr-4! text-lg text-[#2564cf]" />

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={handleAdd}
          placeholder="Add a task"
          bordered={false}
        />
      </div>

      <div className="flex items-center justify-between bg-[#faf9f8] px-4! py-2!">
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
