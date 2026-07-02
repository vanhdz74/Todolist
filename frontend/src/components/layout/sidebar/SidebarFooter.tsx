import {
  FacebookOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";

import { Button, Tooltip } from "antd";

type Props = {
  collapsed: boolean;
};

const contacts = [
  {
    key: "github",
    label: "GitHub",
    icon: <GithubOutlined />,
    href: "https://github.com/your-username",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: <LinkedinOutlined />,
    href: "https://www.linkedin.com/in/your-username",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: <FacebookOutlined />,
    href: "https://www.facebook.com/your-username",
  },
  {
    key: "email",
    label: "Email",
    icon: <MailOutlined />,
    href: "mailto:your-email@gmail.com",
  },
];

export default function SidebarFooter({ collapsed }: Props) {
  return (
    <div
      className={`
        border-t
        border-(--border)
        transition-all
        duration-200

        ${
          collapsed
            ? `
              px-2!
              py-3!
            `
            : `
              px-4!
              py-3!
            `
        }
      `}
    >
      {!collapsed && (
        <p
          className="
            mb-2!
            px-1!
            text-[11px]
            font-semibold
            uppercase
            tracking-wide
            text-(--text-secondary)
          "
        >
          Connect
        </p>
      )}

      <div
        className={`
          ${
            collapsed
              ? `
                grid
                grid-cols-2
                gap-2
                justify-items-center
              `
              : `
                flex
                items-center
                justify-between
                gap-2
              `
          }
        `}
      >
        {contacts.map((contact) => (
          <Tooltip key={contact.key} title={contact.label} placement="top">
            <Button
              type="text"
              size="small"
              icon={contact.icon}
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              className="
                flex!
                h-9!
                w-9!
                items-center!
                justify-center!
                rounded-xl!
                text-(--text-secondary)!
                transition-all!

                hover:bg-(--bg-hover)!
                hover:text-(--primary)!

                focus:bg-(--bg-hover)!
                focus:text-(--primary)!

                focus-visible:bg-(--bg-hover)!
                focus-visible:text-(--primary)!
              "
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
