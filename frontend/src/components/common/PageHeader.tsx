import { Space } from "antd";

import TaskViewSwitch from "@/components/task/TaskViewSwitch";

type Props = {
  icon: React.ReactNode;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  title: string;
  subtitle?: string;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  titleActions?: React.ReactNode;
  actions?: React.ReactNode;
};

// Header trang (dùng )
export default function PageHeader({
  icon,
  iconClassName,
  iconStyle,
  titleStyle,
  title,
  subtitle,
  viewMode,
  setViewMode,
  titleActions,
  actions,
}: Props) {
  return (
    <div className="mt-1! mb-10! flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div
            className={`flex text-2xl ${iconClassName ?? ""}`}
            style={iconStyle}
          >
            {icon}
          </div>

          <h2
            className="m-0 flex items-center gap-1.5 text-2xl"
            style={titleStyle}
          >
            {title}
            {titleActions ?? (
              <span className="text-xl text-[var(--text-disabled)]">...</span>
            )}
          </h2>

          <TaskViewSwitch value={viewMode} onChange={setViewMode} />
        </div>

        {subtitle && (
          <div className="mt-2! text-xs text-[var(--text-secondary)]">
            {subtitle}
          </div>
        )}
      </div>

      <Space>{actions}</Space>
    </div>
  );
}
