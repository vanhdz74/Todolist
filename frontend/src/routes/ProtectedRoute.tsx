import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
