import { Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const TasksPage = () => {
  return (
    <div style={{ padding: "30px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title
        level={3}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#2564cf",
        }}
      >
        <HomeOutlined style={{ fontSize: "24px" }} />
        Tasks
      </Title>
    </div>
  );
};
