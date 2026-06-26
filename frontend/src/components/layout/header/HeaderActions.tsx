import {
  SearchOutlined,
  MoonOutlined,
  SunOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Button, Space, Tooltip, Dropdown, Avatar } from "antd";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useUser, useClerk } from "@clerk/clerk-react";

import SettingsDrawer from "./SettingsDrawer";
import UserDropdown from "./UserDropdown";

export default function HeaderActions() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const [openSetting, setOpenSetting] = useState(false);

  const { user } = useUser();

  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();

    navigate("/login");
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);

    document.documentElement.classList.toggle("dark");
  };

  const items = [
    {
      key: "profile",
      label: user?.fullName || "Profile",
      icon: <UserOutlined />,
    },

    {
      key: "email",
      label: user?.primaryEmailAddress?.emailAddress,
    },

    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Space>
        <Tooltip title="Search">
          <Button
            type="text"
            icon={<SearchOutlined />}
            className="text-white!"
          />
        </Tooltip>

        <Tooltip title="Theme">
          <Button
            type="text"
            icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
            className="text-white!"
            onClick={toggleTheme}
          />
        </Tooltip>

        <Tooltip title="Settings">
          <Button
            type="text"
            icon={<SettingOutlined />}
            className="text-white!"
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
