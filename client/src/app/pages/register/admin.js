"use client"; 
import RegisterForm from "@/components/registerForm"; 
import { useRouter } from "next/router";

export default function AdminRegisterPage() {
  const router = useRouter();

  // navigate back to the login page 
  const navigateToLogin = () => {
    router.push("/login/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10">
        <h2 className="text-xl font-semibold text-center">Register as Admin</h2>
        
        {/* RegisterForm Component */}
        <RegisterForm role="admin" />

        {/* Link to Login Page */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <span
              onClick={navigateToLogin}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}