import {
  LogoutOutlined,
  RightOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Avatar, Dropdown } from "antd";
import { useState, type ReactNode } from "react";

type HeaderUser =
  | {
      imageUrl?: string;
      fullName?: string | null;
      primaryEmailAddress?: {
        emailAddress?: string;
      } | null;
    }
  | null
  | undefined;

type Props = {
  user: HeaderUser;
  handleLogout: () => void;
  openSetting: () => void;
};

type MenuActionProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  danger?: boolean;
  showArrow?: boolean;
  onClick?: () => void;
};

function MenuAction({
  icon,
  label,
  description,
  danger = false,
  showArrow = true,
  onClick,
}: MenuActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        w-full
        flex
        items-center
        gap-3
        px-3!
        py-2.5!
        rounded-xl
        text-left
        outline-none
        transition-all
        duration-200

        ${
          danger
            ? `
              text-[var(--danger)]
              hover:bg-[var(--bg-danger-soft)]
              focus:bg-[var(--bg-danger-soft)]
              focus-visible:bg-[var(--bg-danger-soft)]
            `
            : `
              text-[var(--text-primary)]
              hover:bg-[var(--bg-hover)]
              focus:bg-[var(--bg-hover)]
              focus-visible:bg-[var(--bg-hover)]
            `
        }
      `}
    >
      <span
        className={`
          size-9
          shrink-0
          rounded-xl
          flex
          items-center
          justify-center
          transition-colors

          ${
            danger
              ? `
                bg-[var(--bg-danger-soft)]
                text-[var(--danger)]
              `
              : `
                bg-[var(--bg-muted)]
                text-[var(--text-secondary)]
                group-hover:text-[var(--primary)]
                group-focus:text-[var(--primary)]
                group-focus-visible:text-[var(--primary)]
              `
          }
        `}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium truncate">{label}</span>

        {description && (
          <span
            className="
              block
              mt-0.5!
              text-xs
              text-[var(--text-secondary)]
              truncate
            "
          >
            {description}
          </span>
        )}
      </span>

      {showArrow && (
        <RightOutlined
          className="
            text-xs
            text-[var(--text-tertiary)]
            opacity-0
            -translate-x-1
            transition-all
            duration-200
            group-hover:opacity-100
            group-hover:translate-x-0
            group-focus:opacity-100
            group-focus:translate-x-0
            group-focus-visible:opacity-100
            group-focus-visible:translate-x-0
          "
        />
      )}
    </button>
  );
}

export default function UserDropdown({
  user,
  handleLogout,
  openSetting,
}: Props) {
  const [open, setOpen] = useState(false);

  const userName = user?.fullName || "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "No email";

  const closeDropdown = () => {
    setOpen(false);
  };

  const handleOpenSetting = () => {
    closeDropdown();
    openSetting();
  };

  const handleSignOut = () => {
    closeDropdown();
    handleLogout();
  };

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      placement="bottomRight"
      dropdownRender={() => (
        <div
          className="
            w-[340px]
            mt-2!
            p-2!
            overflow-hidden
            rounded-3xl
            border
            border-[var(--border)]
            bg-[var(--bg-surface)]
            shadow-2xl
          "
        >
          {/* User header */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              p-4!
              bg-gradient-to-br
              from-[var(--primary)]
              to-[var(--primary-hover)]
              text-white
            "
          >
            <div
              className="
                absolute
                -right-10
                -top-10
                size-28
                rounded-full
                bg-white/10
              "
            />

            <div
              className="
                absolute
                right-10
                bottom-3
                size-12
                rounded-full
                bg-white/10
              "
            />

            <div
              className="
                relative
                flex
                items-center
                gap-4
              "
            >
              <Avatar
                size={58}
                src={user?.imageUrl}
                icon={!user?.imageUrl && <UserOutlined />}
                className="
                  shrink-0
                  border-2
                  border-white/70
                  shadow-md
                  bg-white/20!
                "
              />

              <div className="min-w-0 flex-1">
                <p
                  className="
                    m-0!
                    text-[15px]
                    font-semibold
                    truncate
                  "
                >
                  {userName}
                </p>

                <p
                  className="
                    m-0!
                    mt-1!
                    text-sm
                    text-white/80
                    truncate
                  "
                >
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Menu body */}
          <div className="p-2! pt-3!">
            <div
              className="
                px-3!
                py-2!
                text-[11px]
                font-semibold
                uppercase
                tracking-wide
                text-[var(--text-tertiary)]
              "
            >
              Account
            </div>

            <div className="space-y-1">
              <MenuAction
                icon={<UserOutlined />}
                label="My profile"
                description="View your account information"
                onClick={closeDropdown}
              />

              <MenuAction
                icon={<SettingOutlined />}
                label="Settings"
                description="Theme, account and preferences"
                onClick={handleOpenSetting}
              />
            </div>

            <div
              className="
                my-3!
                border-t
                border-[var(--border)]
              "
            />

            <MenuAction
              danger
              icon={<LogoutOutlined />}
              label="Sign out"
              description="Log out of this device"
              showArrow={false}
              onClick={handleSignOut}
            />
          </div>
        </div>
      )}
    >
      <button
        type="button"
        aria-label="Open user menu"
        className="
          size-10
          rounded-full
          flex
          items-center
          justify-center
          outline-none
          transition-all
          duration-200

          hover:bg-white/15
          focus:bg-white/15
          focus-visible:bg-white/15
          focus-visible:ring-2
          focus-visible:ring-white/40
        "
      >
        <Avatar
          size={36}
          src={user?.imageUrl}
          icon={!user?.imageUrl && <UserOutlined />}
          className="
            cursor-pointer
            border
            border-white/30
            shadow-sm
          "
        />
      </button>
    </Dropdown>
  );
}
