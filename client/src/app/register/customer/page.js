"use client";
import RegisterForm from "@/components/registerForm";

export default function CustomerRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10">
        <RegisterForm role="customer" />
      </div>
    </div>
  );
}
