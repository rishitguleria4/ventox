import { SignUp } from "@clerk/nextjs"; 

const page = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </div>
  );
}

export default page;