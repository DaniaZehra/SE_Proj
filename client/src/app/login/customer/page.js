"use client";
import LoginForm from "@/components/loginForm";
import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
  const router = useRouter();

  const navigateToRegister = () => {
    router.push("/register/customer");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10">
        
        <LoginForm role="customer" />

        <div className="text-center mt-4">
          <p className="text-sm">
            New to our app?{" "}
            <span
              onClick={navigateToRegister}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Register now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
