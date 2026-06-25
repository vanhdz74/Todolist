import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { SunOutlined, StarOutlined, HomeOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách các menu ở Sidebar
  const menuItems = [
    {
      key: "/my-day",
      icon: <SunOutlined style={{ color: "#2564cf" }} />,
      label: "My Day",
    },
    {
      key: "/important",
      icon: <StarOutlined style={{ color: "#e33e5a" }} />,
      label: "Important",
    },
    {
      key: "/tasks",
      icon: <HomeOutlined style={{ color: "#2564cf" }} />,
      label: "Tasks",
    },
  ];

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Header màu xanh */}
      <Header
        style={{
          background: "#2564cf",
          height: "48px",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <div style={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>
          To Do
        </div>
      </Header>

      <Layout>
        <Sider
          width={250}
          theme="light"
          style={{ borderRight: "1px solid #edebe9" }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]} // Tự động active menu theo URL
            items={menuItems}
            onClick={(e) => navigate(e.key)} // Chuyển hướng khi click
            style={{ height: "100%", borderRight: 0, marginTop: "16px" }}
          />
        </Sider>

        <Content
          style={{ background: "#faf9f8", height: "100%", overflow: "auto" }}
        >
          {/* Đưa toàn bộ padding và căn giữa ra lớp bọc ngoài cùng của Outlet */}
          <div
            style={{
              padding: "32px", // Padding chung cho mọi trang
              minWidth: "1200px", // Giới hạn chiều rộng chung
              margin: "0 auto", // Căn giữa chung
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Tất cả các trang con bơm vào đây sẽ tự động thụt lề chuẩn */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
