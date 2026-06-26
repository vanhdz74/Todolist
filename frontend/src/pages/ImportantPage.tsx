import { Typography } from "antd";
import { StarOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const ImportantPage = () => {
  return (
    <div style={{ padding: "32px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title
        level={3}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#e33e5a",
        }}
      >
        <StarOutlined style={{ fontSize: "24px" }} />
        Important
      </Title>
    </div>
  );
};
