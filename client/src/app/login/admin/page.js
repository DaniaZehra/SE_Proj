"use client";
import dynamic from 'next/dynamic';
const LoginForm = dynamic(() => import("@/components/loginForm"), { ssr: false });
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const navigateToRegister = () => {
    router.push("/register/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10">
        
        <LoginForm role="admin" />

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
