import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import PageMeta from "./components/PageMeta";

import "./styles/globals.css";
import "./styles/variables.css";

const lazyNamed = <T extends React.ComponentType<object>>(
  importer: () => Promise<Record<string, T>>,
  exportName: string,
) => {
  return lazy(async () => {
    const module = await importer();

    return { default: module[exportName] };
  });
};

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const MyDayPage = lazyNamed(
  () => import("./pages/MyDayPage"),
  "MyDayPage",
);
const ImportantPage = lazyNamed(
  () => import("./pages/ImportantPage"),
  "ImportantPage",
);
const PlannedPage = lazyNamed(
  () => import("./pages/PlannedPage"),
  "PlannedPage",
);
const AssignedPage = lazyNamed(
  () => import("./pages/AssignedPage"),
  "AssignedPage",
);
const TasksPage = lazyNamed(() => import("./pages/TasksPage"), "TasksPage");
const CustomListPage = lazyNamed(
  () => import("./pages/CustomListPage"),
  "CustomListPage",
);

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
    // Code Splitting giúp page nào cần thì mới tải page đó.
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default App;
