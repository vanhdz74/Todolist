import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectSearchQuery } from "@/redux/ui/uiSelector";
import { setSearchQuery } from "@/redux/ui/uiSlice";

export default function HeaderSearch() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);

  return (
    <div className="mx-4 hidden min-w-[240px] max-w-[520px] flex-1 md:block">
      <Input
        allowClear
        value={searchQuery}
        prefix={<SearchOutlined className="text-[var(--text-secondary)]" />}
        placeholder="Search"
        aria-label="Search tasks"
        className="h-8! rounded-sm! border-none! bg-[var(--bg-input)]! shadow-none!"
        onChange={(event) => dispatch(setSearchQuery(event.target.value))}
      />
    </div>
  );
}
