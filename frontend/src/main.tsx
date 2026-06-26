import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from "./app/store";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

import App from "./App.tsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <Provider store={store}>
        <App />
      </Provider>
    </ClerkProvider>
  </StrictMode>,
);c
