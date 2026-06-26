import { CheckSquareOutlined } from "@ant-design/icons";

export default function Logo() {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-white
        font-semibold
      "
    >
      <CheckSquareOutlined className="text-xl" />

      <span>To Do</span>
    </div>
  );
}
