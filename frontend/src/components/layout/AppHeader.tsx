import { Layout } from "antd";

import Logo from "./header/Logo";
import HeaderActions from "./header/HeaderActions";
import HeaderSearch from "./header/HeaderSearch";

const { Header } = Layout;

export default function AppHeader() {
  return (
    <Header
      className="
        bg-[var(--bg-header)]!
        h-12!
        flex
        items-center
        justify-between
        px-4!
      "
    >
      <Logo />

      <HeaderSearch />

      <HeaderActions />
    </Header>
  );
}
