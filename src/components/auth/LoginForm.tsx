import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { Button } from "../ui/Button";
import { InputField } from "../forms/InputField";
import { loginSchema, LoginForm as LoginFormType } from "../../schemas/auth";

interface LoginFormProps {
  onSubmit: (data: LoginFormType) => Promise<void>;
  isSubmitting: boolean;
}

export function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        label="Email"
        type="email"
        icon={Mail}
        {...register("email")}
        error={errors.email?.message}
        placeholder="you@example.com"
      />

      <InputField
        label="Password"
        type="password"
        icon={Lock}
        {...register("password")}
        error={errors.password?.message}
        placeholder="••••••••"
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
