import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import { MyDayPage, ImportantPage, TasksPage } from "./pages";

import "./index.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* Cần login */}
        <Route element={<ProtectedRoute />}>
          {/* App */}
          <Route path="/" element={<MainLayout />}>
            {/* / tự chuyển sang /my-day */}
            <Route index element={<Navigate to="/my-day" replace />} />

            <Route path="my-day" element={<MyDayPage />} />

            <Route path="important" element={<ImportantPage />} />

            <Route path="tasks" element={<TasksPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
