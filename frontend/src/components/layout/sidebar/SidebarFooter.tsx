import {
  FacebookOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";

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

export default function SidebarFooter() {
  return (
    <div className="flex h-14 items-center justify-center gap-1 border-t border-[var(--border)] px-2">
      {contacts.map((contact) => (
        <Tooltip key={contact.key} title={contact.label}>
          <Button
            type="text"
            size="small"
            icon={contact.icon}
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            className="!flex !h-8 !w-8 !items-center !justify-center !rounded-md !text-[var(--text-secondary)] hover:!bg-[var(--bg-hover)] hover:!text-[var(--accent)]"
          />
        </Tooltip>
      ))}

      <Tooltip title="Settings">
        <Button
          type="text"
          size="small"
          icon={<SettingOutlined />}
          className="flex! !h-8 !w-8 !items-center !justify-center !rounded-md !text-[var(--text-secondary)] hover:!bg-[var(--bg-hover)] hover:!text-[var(--accent)]"
        />
      </Tooltip>
    </div>
  );
}
