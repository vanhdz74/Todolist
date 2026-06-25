import { Typography, Input, Button, Space } from "antd";
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

const { Title, Text } = Typography;

export const DashboardPage = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "32px 48px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Top Header của My Day */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#333",
            }}
          >
            <SunOutlined style={{ fontSize: "24px" }} />
            My Day
            <span
              style={{
                color: "#8c8c8c",
                fontSize: "20px",
                cursor: "pointer",
                marginLeft: "4px",
              }}
            >
              ...
            </span>
          </Title>
          <Text style={{ color: "#605e5c", fontSize: "12px" }}>
            Friday, June 26
          </Text>
        </div>

        <Space size="middle">
          <Button
            type="text"
            icon={<SwapOutlined />}
            style={{ color: "#605e5c" }}
          >
            Sort
          </Button>
          <Button
            type="text"
            icon={<AppstoreAddOutlined />}
            style={{ color: "#605e5c" }}
          >
            Group
          </Button>
          <Button
            type="text"
            icon={<BulbOutlined />}
            style={{ color: "#605e5c" }}
          >
            Suggestions
          </Button>
        </Space>
      </div>

      {/* Box nhập Add a task (Trắng, có viền bo góc) */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          border: "1px solid #edebe9",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        {/* Hàng 1: Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #edebe9",
          }}
        >
          <BorderOutlined
            style={{ fontSize: "20px", color: "#2564cf", marginRight: "16px" }}
          />
          <Input
            placeholder="Add a task"
            bordered={false}
            style={{ fontSize: "14px", padding: 0 }}
          />
        </div>

        {/* Hàng 2: Các nút công cụ và nút Add */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: "#faf9f8",
          }}
        >
          <Space size="middle">
            <Button
              type="text"
              size="small"
              icon={<CalendarOutlined style={{ color: "#605e5c" }} />}
            />
            <Button
              type="text"
              size="small"
              icon={<BellOutlined style={{ color: "#605e5c" }} />}
            />
            <Button
              type="text"
              size="small"
              icon={<SyncOutlined style={{ color: "#605e5c" }} />}
            />
          </Space>
          <Button size="small" style={{ color: "#8c8c8c" }}>
            Add
          </Button>
        </div>
      </div>

      {/* Chỗ này sẽ là danh sách Task bằng antd List sau khi có dữ liệu */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Placeholder cho danh sách task */}
      </div>
    </div>
  );
};
