import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/Sidebar";

const { Content } = Layout;

export default function MainLayout() {
  return (
    <Layout className="h-screen overflow-hidden">
      {/* Header */}
      <AppHeader />

      {/* Content */}
      <Layout>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Content className="bg-[#faf9f8] overflow-auto">
          <div
            className="
              min-w-300
              min-h-full
              p-6!
              mx-auto
              flex
              flex-col
            "
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
