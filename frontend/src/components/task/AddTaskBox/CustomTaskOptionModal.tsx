import { DatePicker, InputNumber, Modal, Select, TimePicker } from "antd";
import type { Dayjs } from "dayjs";

import type { CustomType, RepeatUnit } from "./addTaskTypes";

type Props = {
  customType: CustomType;

  customDueDate: Dayjs | null;
  onCustomDueDateChange: (value: Dayjs | null) => void;

  customReminderDate: Dayjs | null;
  onCustomReminderDateChange: (value: Dayjs | null) => void;

  customReminderTime: Dayjs | null;
  onCustomReminderTimeChange: (value: Dayjs | null) => void;

  customRepeatEvery: number;
  onCustomRepeatEveryChange: (value: number) => void;

  customRepeatUnit: RepeatUnit;
  onCustomRepeatUnitChange: (value: RepeatUnit) => void;

  onCancel: () => void;
  onConfirm: () => void;
};

export default function CustomTaskOptionModal({
  customType,

  customDueDate,
  onCustomDueDateChange,

  customReminderDate,
  onCustomReminderDateChange,

  customReminderTime,
  onCustomReminderTimeChange,

  customRepeatEvery,
  onCustomRepeatEveryChange,

  customRepeatUnit,
  onCustomRepeatUnitChange,

  onCancel,
  onConfirm,
}: Props) {
  const title =
    customType === "due"
      ? "Pick a date"
      : customType === "reminder"
        ? "Pick reminder"
        : "Custom repeat";

  const isConfirmDisabled =
    (customType === "due" && !customDueDate) ||
    (customType === "reminder" && (!customReminderDate || !customReminderTime));

  return (
    <Modal
      title={title}
      open={customType !== null}
      okText="Save"
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{
        disabled: isConfirmDisabled,
      }}
    >
      {customType === "due" && (
        <DatePicker
          className="w-full"
          value={customDueDate}
          onChange={onCustomDueDateChange}
          placeholder="Select due date"
        />
      )}

      {customType === "reminder" && (
        <div className="flex gap-3">
          <DatePicker
            className="flex-1"
            value={customReminderDate}
            onChange={onCustomReminderDateChange}
            placeholder="Select date"
          />

          <TimePicker
            className="flex-1"
            value={customReminderTime}
            onChange={onCustomReminderTimeChange}
            format="HH:mm"
            placeholder="Select time"
          />
        </div>
      )}

      {customType === "repeat" && (
        <div className="flex items-center gap-3">
          <span>Every</span>

          <InputNumber
            min={1}
            value={customRepeatEvery}
            onChange={(value) => onCustomRepeatEveryChange(value ?? 1)}
          />

          <Select<RepeatUnit>
            className="min-w-32"
            value={customRepeatUnit}
            onChange={onCustomRepeatUnitChange}
            options={[
              {
                label: "Day",
                value: "day",
              },
              {
                label: "Week",
                value: "week",
              },
              {
                label: "Month",
                value: "month",
              },
              {
                label: "Year",
                value: "year",
              },
            ]}
          />
        </div>
      )}
    </Modal>
  );
}
