import { useMemo, useState } from "react";

import {
  BellOutlined,
  BorderOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Space } from "antd";
import type { MenuProps } from "antd";
import type { Dayjs } from "dayjs";

import CustomTaskOptionModal from "./CustomTaskOptionModal";
import {
  createDropdownItems,
  createDueDateOptions,
  createOptionMenuItems,
  reminderOptions,
  repeatOptions,
} from "./addTaskOptions";
import type {
  AddTaskOptions,
  CustomType,
  OptionItem,
  RepeatUnit,
} from "./addTaskTypes";
import { getRepeatLabel } from "./addTaskUtils";

type Props = {
  onAdd?: (title: string, options?: AddTaskOptions) => void;
};

export default function AddTaskBox({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const [dueDate, setDueDate] = useState<OptionItem | null>(null);
  const [reminder, setReminder] = useState<OptionItem | null>(null);
  const [repeat, setRepeat] = useState<OptionItem | null>(null);

  const [customType, setCustomType] = useState<CustomType>(null);

  const [customDueDate, setCustomDueDate] = useState<Dayjs | null>(null);

  const [customReminderDate, setCustomReminderDate] = useState<Dayjs | null>(
    null,
  );

  const [customReminderTime, setCustomReminderTime] = useState<Dayjs | null>(
    null,
  );

  const [customRepeatEvery, setCustomRepeatEvery] = useState(1);

  const [customRepeatUnit, setCustomRepeatUnit] = useState<RepeatUnit>("week");

  const dueDateOptions = useMemo(() => createDueDateOptions(), []);

  const dueDateItems = useMemo(() => {
    return createDropdownItems("Due", createOptionMenuItems(dueDateOptions));
  }, [dueDateOptions]);

  const reminderItems = useMemo(() => {
    return createDropdownItems(
      "Reminder",
      createOptionMenuItems(reminderOptions),
    );
  }, []);

  const repeatItems = useMemo(() => {
    return createDropdownItems("Repeat", createOptionMenuItems(repeatOptions));
  }, []);

  // Add khi có tt -> db
  const handleAdd = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    onAdd?.(trimmedTitle, {
      dueDate: dueDate?.value ?? null,
      reminder: reminder?.value ?? null,
      repeat: repeat?.value ?? null,
    });

    setTitle("");
    setDueDate(null);
    setReminder(null);
    setRepeat(null);
  };

  // Pick due
  const handleDueDateClick: MenuProps["onClick"] = ({ key }) => {
    const selectedOption = dueDateOptions.find((item) => item.key === key);

    if (!selectedOption) return;

    if (selectedOption.key === "pick-date") {
      setCustomType("due");
      return;
    }

    setDueDate(selectedOption.value ? selectedOption : null);
  };

  // Pick remider
  const handleReminderClick: MenuProps["onClick"] = ({ key }) => {
    const selectedOption = reminderOptions.find((item) => item.key === key);

    if (!selectedOption) return;

    if (selectedOption.key === "pick-reminder") {
      setCustomType("reminder");
      return;
    }

    setReminder(selectedOption.value ? selectedOption : null);
  };

  // Pick repeat
  const handleRepeatClick: MenuProps["onClick"] = ({ key }) => {
    const selectedOption = repeatOptions.find((item) => item.key === key);

    if (!selectedOption) return;

    if (selectedOption.key === "custom-repeat") {
      setCustomType("repeat");
      return;
    }

    setRepeat(selectedOption.value ? selectedOption : null);
  };

  const handleCloseCustomModal = () => {
    setCustomType(null);
  };

  const handleConfirmCustom = () => {
    if (customType === "due") {
      if (!customDueDate) return;

      setDueDate({
        key: "custom-due",
        label: customDueDate.format("MMM D"),
        value: customDueDate.format("YYYY-MM-DD"),
        icon: <FieldTimeOutlined />,
      });

      setCustomType(null);
      return;
    }

    if (customType === "reminder") {
      if (!customReminderDate || !customReminderTime) return;

      setReminder({
        key: "custom-reminder",
        label: `${customReminderDate.format(
          "MMM D",
        )}, ${customReminderTime.format("HH:mm")}`,
        value: `${customReminderDate.format(
          "YYYY-MM-DD",
        )} ${customReminderTime.format("HH:mm")}`,
        icon: <FieldTimeOutlined />,
      });

      setCustomType(null);
      return;
    }

    if (customType === "repeat") {
      const label = getRepeatLabel(customRepeatEvery, customRepeatUnit);

      setRepeat({
        key: "custom-repeat-value",
        label,
        value: `every-${customRepeatEvery}-${customRepeatUnit}`,
        icon: <SyncOutlined />,
      });

      setCustomType(null);
    }
  };

  return (
    <>
      <div className="add-task-box mb-4! overflow-hidden rounded border border-(--border-strong) bg-(--bg-surface) shadow">
        <div className="flex items-center border-b border-(--border) px-4! py-3!">
          <BorderOutlined className="add-task-box__main-icon mr-4! text-lg" />

          <Input
            className="add-task-box__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleAdd}
            placeholder="Add a task"
            variant="borderless"
          />
        </div>

        <div className="flex items-center justify-between bg-(--bg-app) px-4! py-2!">
          <Space className="add-task-box__actions">
            <Dropdown
              trigger={["click"]}
              menu={{
                items: dueDateItems,
                onClick: handleDueDateClick,
                selectedKeys: dueDate ? [dueDate.key] : [],
              }}
            >
              <Button type="text" icon={<CalendarOutlined />}>
                {dueDate?.label}
              </Button>
            </Dropdown>

            <Dropdown
              trigger={["click"]}
              menu={{
                items: reminderItems,
                onClick: handleReminderClick,
                selectedKeys: reminder ? [reminder.key] : [],
              }}
            >
              <Button type="text" icon={<BellOutlined />}>
                {reminder?.label}
              </Button>
            </Dropdown>

            <Dropdown
              trigger={["click"]}
              menu={{
                items: repeatItems,
                onClick: handleRepeatClick,
                selectedKeys: repeat ? [repeat.key] : [],
              }}
            >
              <Button type="text" icon={<SyncOutlined />}>
                {repeat?.label}
              </Button>
            </Dropdown>
          </Space>

          <Button
            className="add-task-box__submit"
            size="small"
            disabled={!title.trim()}
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      </div>

      <CustomTaskOptionModal
        //
        customType={customType}
        customDueDate={customDueDate}
        
        //
        onCustomDueDateChange={setCustomDueDate}
        customReminderDate={customReminderDate}

        //
        onCustomReminderDateChange={setCustomReminderDate}
        customReminderTime={customReminderTime}

        //
        onCustomReminderTimeChange={setCustomReminderTime}
        customRepeatEvery={customRepeatEvery}

        //
        onCustomRepeatEveryChange={setCustomRepeatEvery}
        customRepeatUnit={customRepeatUnit}

        //
        onCustomRepeatUnitChange={setCustomRepeatUnit}
        onCancel={handleCloseCustomModal}
        onConfirm={handleConfirmCustom}
      />
    </>
  );
}
