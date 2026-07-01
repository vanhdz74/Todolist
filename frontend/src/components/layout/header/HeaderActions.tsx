import {
  SearchOutlined,
  MoonOutlined,
  SunOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { Button, Space, Tooltip } from "antd";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useUser, useClerk } from "@clerk/clerk-react";

import SettingsDrawer from "./SettingsDrawer";
import UserDropdown from "./UserDropdown";
import {
  applyThemeMode,
  getStoredThemeMode,
  persistThemeMode,
} from "@/utils/themeMode";

export default function HeaderActions() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => getStoredThemeMode() === "dark",
  );

  const [openSetting, setOpenSetting] = useState(false);

  const { user } = useUser();

  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();

    navigate("/login");
  };

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const nextMode = prev ? "light" : "dark";

      persistThemeMode(nextMode);
      applyThemeMode(nextMode);

      return nextMode === "dark";
    });
  };

  return (
    <>
      <Space>
        <Tooltip title="Search">
          <Button
            type="text"
            icon={<SearchOutlined />}
            className="text-(--text-on-primary)!"
          />
        </Tooltip>

        <Tooltip title="Theme">
          <Button
            type="text"
            icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
            className="text-(--text-on-primary)!"
            onClick={toggleTheme}
          />
        </Tooltip>

        <Tooltip title="Settings">
          <Button
            type="text"
            icon={<SettingOutlined />}
            className="text-(--text-on-primary)!"
            onClick={() => setOpenSetting(true)}
          />
        </Tooltip>

        {/* User Dropdown */}
        <UserDropdown
          user={user}
          handleLogout={handleLogout}
          openSetting={() => setOpenSetting(true)}
        />
      </Space>

      {/* Settings Drawer */}
      <SettingsDrawer
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        email={user?.primaryEmailAddress?.emailAddress}
      />
    </>
  );
}
