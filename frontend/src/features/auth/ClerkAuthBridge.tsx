import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { setClerkTokenGetter } from "@/services/axios";

type ClerkAuthBridgeProps = {
  children: ReactNode;
};

// bridge component lấy getToken bằng useAuth() rồi đăng ký cho axios.
const ClerkAuthBridge = ({ children }: ClerkAuthBridgeProps) => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    setClerkTokenGetter(isSignedIn ? getToken : null);

    return () => {
      setClerkTokenGetter(null);
    };
  }, [getToken, isSignedIn]);

  return children;
};

export default ClerkAuthBridge;
