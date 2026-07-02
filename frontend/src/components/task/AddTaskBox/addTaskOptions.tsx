import {
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  HistoryOutlined,
  StopOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

import type { OptionItem } from "./addTaskTypes";
import { addDays, formatDateValue, getWeekday } from "./addTaskUtils";

// Các option
export const createDueDateOptions = (): OptionItem[] => {
  const today = new Date();
  const tomorrow = addDays(1);
  const nextWeek = addDays(7);

  return [
    {
      key: "today",
      label: "Today",
      value: formatDateValue(today),
      icon: <CalendarOutlined />,
      suffix: getWeekday(today),
    },
    {
      key: "tomorrow",
      label: "Tomorrow",
      value: formatDateValue(tomorrow),
      icon: <ClockCircleOutlined />,
      suffix: getWeekday(tomorrow),
    },
    {
      key: "next-week",
      label: "Next week",
      value: formatDateValue(nextWeek),
      icon: <HistoryOutlined />,
      suffix: getWeekday(nextWeek),
    },
    {
      key: "pick-date",
      label: "Pick a date",
      value: "custom",
      icon: <FieldTimeOutlined />,
    },
    {
      key: "no-date",
      label: "No date",
      value: null,
      icon: <StopOutlined />,
    },
  ];
};

export const reminderOptions: OptionItem[] = [
  {
    key: "later-today",
    label: "Later today",
    value: "later-today",
    icon: <BellOutlined />,
    suffix: "Today",
  },
  {
    key: "tomorrow-morning",
    label: "Tomorrow morning",
    value: "tomorrow-morning",
    icon: <ClockCircleOutlined />,
    suffix: "9 AM",
  },
  {
    key: "next-week",
    label: "Next week",
    value: "next-week",
    icon: <HistoryOutlined />,
    suffix: "Mon",
  },
  {
    key: "pick-reminder",
    label: "Pick date & time",
    value: "custom",
    icon: <FieldTimeOutlined />,
  },
  {
    key: "no-reminder",
    label: "No reminder",
    value: null,
    icon: <StopOutlined />,
  },
];

export const repeatOptions: OptionItem[] = [
  {
    key: "daily",
    label: "Daily",
    value: "daily",
    icon: <SyncOutlined />,
  },
  {
    key: "weekdays",
    label: "Weekdays",
    value: "weekdays",
    icon: <SyncOutlined />,
  },
  {
    key: "weekly",
    label: "Weekly",
    value: "weekly",
    icon: <SyncOutlined />,
  },
  {
    key: "monthly",
    label: "Monthly",
    value: "monthly",
    icon: <SyncOutlined />,
  },
  {
    key: "custom-repeat",
    label: "Custom repeat",
    value: "custom",
    icon: <FieldTimeOutlined />,
  },
  {
    key: "no-repeat",
    label: "No repeat",
    value: null,
    icon: <StopOutlined />,
  },
];

export const renderDropdownItem = (item: OptionItem) => {
  return (
    <div className="flex min-w-48 items-center justify-between gap-6">
      <span className="flex items-center gap-3">
        <span className="text-base text-(--text-secondary)">{item.icon}</span>
        <span>{item.label}</span>
      </span>

      {item.suffix && (
        <span className="text-xs text-(--text-secondary)">{item.suffix}</span>
      )}
    </div>
  );
};

export const createOptionMenuItems = (
  options: OptionItem[],
): MenuProps["items"] => {
  return options.map((item) => ({
    key: item.key,
    label: renderDropdownItem(item),
  }));
};

export const createDropdownItems = (
  title: string,
  options: MenuProps["items"],
): MenuProps["items"] => {
  return [
    {
      key: `${title}-title`,
      label: (
        <div className="px-3! py-2! text-center text-sm font-semibold text-(--text-primary)">
          {title}
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    ...(options ?? []),
  ];
};
