import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
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
      <SignUp />
    </div>
  );
};

export default RegisterPage;
