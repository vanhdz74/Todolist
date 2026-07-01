import { FolderOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Input } from "antd";

import type { DraftMode } from "./types";

type Props = {
  draftMode: DraftMode;
  draftName: string;
  onCancel: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function CreateListDraft({
  draftMode,
  draftName,
  onCancel,
  onChange,
  onSubmit,
}: Props) {
  const draftIcon =
    draftMode === "group" ? (
      <FolderOutlined className="text-[var(--text-secondary)]" />
    ) : (
      <UnorderedListOutlined className="text-[var(--text-secondary)]" />
    );

  return (
    <div className="mx-2! mb-1! flex h-10 items-center gap-2! rounded-sm bg-[var(--bg-input)] px-3! shadow-[inset_0_0_0_1px_var(--border-strong)]">
      {draftIcon}
      <Input
        autoFocus
        value={draftName}
        onChange={(event) => onChange(event.target.value)}
        onPressEnter={onSubmit}
        onBlur={onSubmit}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
        bordered={false}
        placeholder={draftMode === "group" ? "Group name" : "List name"}
        className="px-0! text-sm"
      />
    </div>
  );
}
