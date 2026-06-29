import { Space } from "antd";

import TaskViewSwitch from "@/components/task/TaskViewSwitch";

type Props = {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  subtitle?: string;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  actions?: React.ReactNode;
};

// Header trang (dùng )
export default function PageHeader({
  icon,
  iconClassName,
  title,
  subtitle,
  viewMode,
  setViewMode,
  actions,
}: Props) {
  return (
    <div className="mt-1! mb-10! flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className={`flex text-2xl ${iconClassName ?? ""}`}>{icon}</div>

          <h2 className="m-0 flex items-center gap-1.5 text-2xl">
            {title}
            <span className="text-xl text-[#8c8c8c]">...</span>
          </h2>

          <TaskViewSwitch value={viewMode} onChange={setViewMode} />
        </div>

        {subtitle && (
          <div className="mt-2! text-xs text-[#605e5c]">{subtitle}</div>
        )}
      </div>

      <Space>{actions}</Space>
    </div>
  );
}
