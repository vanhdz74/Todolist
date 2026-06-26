import { Segmented } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";

type Props = {
  value: "grid" | "list";
  onChange: (value: "grid" | "list") => void;
};

export default function TaskViewSwitch({ value, onChange }: Props) {
  return (
    <Segmented
      value={value}
      onChange={(v) => onChange(v as "grid" | "list")}
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
  );
}
