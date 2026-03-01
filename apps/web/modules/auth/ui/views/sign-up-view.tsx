import { SignUp } from "@clerk/nextjs"; 

export const SignUpView = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </div>
  );
}
