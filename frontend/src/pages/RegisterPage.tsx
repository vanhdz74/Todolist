import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[var(--bg-app)]
    "
    >
      <SignUp />
    </div>
  );
};

export default RegisterPage;
