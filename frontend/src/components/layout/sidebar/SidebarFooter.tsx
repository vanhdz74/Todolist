import { SettingOutlined } from "@ant-design/icons";

import { Button } from "antd";

export default function SidebarFooter() {
  return (
    <div
      className="
        h-14
        border-t
        border-(--border)
        flex
        items-center
        px-auto
        justify-center
        "
    >
      <Button type="text" icon={<SettingOutlined />}></Button>
    </div>
  );
}
