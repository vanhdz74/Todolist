import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from "./app/store";
import ClerkAuthBridge from "./features/auth/ClerkAuthBridge";
import { applyThemeMode, getStoredThemeMode } from "./utils/themeMode";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

import App from "./App.tsx";
import { Provider } from "react-redux";

applyThemeMode(getStoredThemeMode());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <ClerkAuthBridge>
        <Provider store={store}>
          <App />
        </Provider>
      </ClerkAuthBridge>
    </ClerkProvider>
  </StrictMode>,
);
