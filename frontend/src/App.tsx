import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import {
  MyDayPage,
  ImportantPage,
  TasksPage,
  PlannedPage,
  AssignedPage,
  CustomListPage,
} from "./pages";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PageMeta from "./components/PageMeta";

import "./styles/globals.css";
import "./styles/variables.css";

const withMeta = (
  element: React.ReactNode,
  title: string,
  description?: string,
) => {
  return (
    <>
      <PageMeta title={title} description={description} />
      {element}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={withMeta(
            <LoginPage />,
            "Login | Todo App",
            "Đăng nhập vào Todo App.",
          )}
        />

        <Route
          path="/register"
          element={withMeta(
            <RegisterPage />,
            "Register | Todo App",
            "Tạo tài khoản Todo App.",
          )}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/my-day" replace />} />

            <Route
              path="my-day"
              element={withMeta(
                <MyDayPage />,
                "My Day | Todo App",
                "Danh sách công việc trong ngày.",
              )}
            />

            <Route
              path="important"
              element={withMeta(
                <ImportantPage />,
                "Important | Todo App",
                "Các công việc quan trọng.",
              )}
            />

            <Route
              path="planned"
              element={withMeta(
                <PlannedPage />,
                "Planned | Todo App",
                "Các công việc đã lên kế hoạch.",
              )}
            />

            <Route
              path="assigned"
              element={withMeta(
                <AssignedPage />,
                "Assigned to me | Todo App",
                "Các công việc được giao cho bạn.",
              )}
            />

            <Route
              path="tasks"
              element={withMeta(
                <TasksPage />,
                "Tasks | Todo App",
                "Tất cả công việc của bạn.",
              )}
            />

            {/* Phần list + group */}
            <Route
              path="lists/:listId"
              element={withMeta(
                <CustomListPage />,
                "Custom List | Todo App",
                "Danh sách công việc tùy chỉnh.",
              )}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
