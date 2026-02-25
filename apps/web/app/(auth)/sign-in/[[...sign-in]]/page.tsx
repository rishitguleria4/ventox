import { SignIn } from "@clerk/nextjs"; 

const page = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </div>
  );
}

export default page;