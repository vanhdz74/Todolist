import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Dropdown, Avatar } from "antd";

type HeaderUser = {
  imageUrl?: string;
  fullName?: string | null;
  primaryEmailAddress?: {
    emailAddress?: string;
  } | null;
} | null | undefined;

type Props = {
  user: HeaderUser;
  handleLogout: () => void;
  openSetting: () => void;
};

export default function UserDropdown({
  user,
  handleLogout,
  openSetting,
}: Props) {
  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      dropdownRender={() => (
        <div
          className="
            w-[320px]
            bg-[var(--bg-surface)]
            rounded-2xl
            shadow-xl
            border
            border-[var(--border)]
            overflow-hidden
            mt-2
            p-5!
          "
        >
          {/* User Header */}

          <div
            className="
              px-5
              py-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-5
              "
            >
              <Avatar
                size={56}
                src={user?.imageUrl}
                icon={!user?.imageUrl && <UserOutlined />}
              />

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    font-semibold
                    text-[15px]
                    truncate
                  "
                >
                  {user?.fullName || "User"}
                </p>

                <p
                  className="
                    text-sm
                    text-[var(--text-secondary)]
                    truncate
                    mt-1
                  "
                >
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* divider */}

          <div
            className="
              border-t
              border-[var(--border)]
            "
          />

          {/* Menu */}

          <div
            className="
              p-3
              mt-4!
            "
          >
            <button
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                text-sm
                hover:bg-[var(--bg-hover)]
                transition
              "
            >
              <UserOutlined />

              <span>My profile</span>
            </button>

            <button
              onClick={openSetting}
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                text-sm
                hover:bg-[var(--bg-hover)]
                transition
              "
            >
              <SettingOutlined />

              <span>Settings</span>
            </button>

            <div
              className="
                my-2
                border-t
                border-[var(--border)]
              "
            />

            <button
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                text-sm
                text-[var(--danger)]
                hover:bg-[var(--bg-danger-soft)]
                transition
              "
            >
              <LogoutOutlined />

              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    >
      <Avatar
        size={36}
        src={user?.imageUrl}
        icon={!user?.imageUrl && <UserOutlined />}
        className="
          cursor-pointer
          hover:opacity-80
          transition
        "
      />
    </Dropdown>
  );
}
