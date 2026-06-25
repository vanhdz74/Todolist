import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { MyDayPage, ImportantPage, TasksPage } from "./pages";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout cha bọc toàn bộ khung giao diện */}
        <Route path="/" element={<MainLayout />}>
          {/* Mặc định vào "/" sẽ tự chuyển hướng sang "/my-day" */}
          <Route index element={<Navigate to="/my-day" replace />} />

          {/* Các Route con thay đổi bên trong Outlet của MainLayout */}
          <Route path="my-day" element={<MyDayPage />} />
          <Route path="important" element={<ImportantPage />} />
          <Route path="tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
