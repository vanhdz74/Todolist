import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    "
    >
      <SignIn />
    </div>
  );
};

export default LoginPage;
