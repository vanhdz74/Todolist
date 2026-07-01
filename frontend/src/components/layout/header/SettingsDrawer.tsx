import { Drawer, Switch, Divider } from "antd";

type Props = {
  open: boolean;

  onClose: () => void;

  darkMode: boolean;

  toggleTheme: () => void;

  email?: string;
};

export default function SettingsDrawer({
  open,

  onClose,

  darkMode,

  toggleTheme,

  email,
}: Props) {
  return (
    <Drawer
      title="Settings"
      placement="right"
      width={360}
      open={open}
      onClose={onClose}
      mask={false}
      maskClosable={false}
      styles={{
        wrapper: {
          boxShadow: "var(--shadow)",
          top: "50px", // chiều cao header
          height: "calc(100% - 64px)",
        },
      }}
    >
      <div className="space-y-6">
        {/* Account */}

        <div>
          <h3 className="font-semibold text-lg">Account</h3>

          <p className="mt-2 text-[var(--text-secondary)]">{email}</p>
        </div>

        <Divider />

        {/* Appearance */}

        <div>
          <h3 className="font-semibold text-lg mb-4">Appearance</h3>

          <div
            className="
            flex 
            justify-between 
            items-center
            mb-4
          "
          >
            <div>
              <p>Dark mode</p>

              <span className="text-sm text-[var(--text-disabled)]">
                Change application theme
              </span>
            </div>

            <Switch checked={darkMode} onChange={toggleTheme} />
          </div>

          <div
            className="
            flex 
            justify-between 
            items-center
          "
          >
            <div>
              <p>Compact layout</p>

              <span className="text-sm text-[var(--text-disabled)]">
                Reduce spacing
              </span>
            </div>

            <Switch />
          </div>
        </div>

        <Divider />

        {/* Notification */}

        <div>
          <h3 className="font-semibold text-lg mb-4">Notification</h3>

          <div
            className="
            flex 
            justify-between 
            items-center
          "
          >
            <div>
              <p>Task reminder</p>

              <span className="text-sm text-[var(--text-disabled)]">
                Receive task alerts
              </span>
            </div>

            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
