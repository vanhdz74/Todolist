import { Segmented, Space, Button } from "antd";

import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";

type Props = {
  icon: React.ReactNode;

  title: string;

  subtitle?: string;

  viewMode: "grid" | "list";

  setViewMode: (value: "grid" | "list") => void;

  actions?: React.ReactNode;
};

export default function PageHeader({
  icon,

  title,

  subtitle,

  viewMode,

  setViewMode,

  actions,
}: Props) {
  return (
    <div
      style={{
        display: "flex",

        justifyContent: "space-between",

        alignItems: "flex-start",

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
          <div>{icon}</div>

          <h2
            style={{
              margin: 0,

              display: "flex",

              alignItems: "center",

              gap: 6,

              fontSize: 24,
            }}
          >
            {title}

            <span
              style={{
                color: "#8c8c8c",

                fontSize: 20,
              }}
            >
              ...
            </span>
          </h2>

          <Segmented
            size="large"
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

        {subtitle && (
          <div
            style={{
              marginTop: 4,

              color: "#605e5c",

              fontSize: 12,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <Space>{actions}</Space>
    </div>
  );
}
