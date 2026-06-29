import { Layout } from "antd";

import Logo from "./header/Logo";
import HeaderActions from "./header/HeaderActions";

const { Header } = Layout;

export default function AppHeader() {
  return (
    <Header
      className="
        bg-(--primary)!
        h-12!
        flex
        items-center
        justify-between
        px-4!
      "
    >
      <Logo />

      <HeaderActions />
    </Header>
  );
}
