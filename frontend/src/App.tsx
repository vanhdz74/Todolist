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

import "./styles/globals.css";
import "./styles/variables.css";
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

            <Route path="planned" element={<PlannedPage />} />

            <Route path="assigned" element={<AssignedPage />} />

            <Route path="tasks" element={<TasksPage />} />

            <Route path=":listKey" element={<CustomListPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
