import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Dropdown, Avatar } from "antd";

type Props = {
  user: any;
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
            bg-white
            rounded-2xl
            shadow-xl
            border
            border-gray-200
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
                    text-gray-500
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
              border-gray-100
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
                hover:bg-gray-100
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
                hover:bg-gray-100
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
                border-gray-100
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
                text-red-500
                hover:bg-red-50
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
