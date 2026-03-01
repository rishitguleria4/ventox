import { SignUp } from "@clerk/nextjs"; 

export const SignUpview = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </div>
  );
}
