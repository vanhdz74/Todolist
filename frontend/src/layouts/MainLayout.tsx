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
      <Layout className="min-h-0">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Content className="min-h-0 overflow-hidden bg-[var(--bg-app)]">
          <div
            className="
              min-w-300
              h-full
              min-h-0
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
