import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { RootLayout } from "../../components/Layouts";
import { Button, Input } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { loginUser } from "../../api/auth.api";
import { setToken } from "../../util/auth.util";
import { loginSchema, type LoginFormData } from "../../schemas/auth.schema";

const Login = () => {
  const navigate = useNavigate();
  const routeApi = getRouteApi("/auth/_auth/login");
  const { redirect } = routeApi.useSearch();

  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await loginUser(data);
    },
    onSuccess: (response: any) => {
      setToken(response?.data?.accessToken);
      navigate({ to: redirect || "/dashboard", replace: true });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormData,
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return (
    <RootLayout className="justify-center items-center flex">
      {/* Login Form */}
      <form
        className="flex flex-col items-center justify-center w-full max-w-xs px-8 sm:px-6 md:px-0 gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <img src={Logo} alt="TrendBits Logo" className="w-16 h-16" />
          <h2 className="font-fredoka font-medium text-3xl">TrendBits</h2>
        </div>

        {/* Api Error Field */}
        {loginMutation.isError && (
          <div className="w-full bg-red-100 text-red-800 p-3 rounded-lg mb-2">
            <p className="text-sm">{loginMutation.error.message}</p>
          </div>
        )}

        {/* Form Fields */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = loginSchema.shape.email.safeParse(value);
              return result.success ? undefined : result.error.errors[0]?.message;
            },
          }}
          children={(field) => (
            <Input
              type="email"
              name={field.name}
              placeholder="example@mail.com"
              autoComplete="off"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full"
              leftIcon={<Mail size={18} />}
              error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : ""}
            />
          )}
        />
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = loginSchema.shape.password.safeParse(value);
              return result.success ? undefined : result.error.errors[0]?.message;
            },
          }}
          children={(field) => (
            <Input
              type={showPassword ? "text" : "password"}
              name={field.name}
              value={field.state.value}
              placeholder="Password"
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full"
              leftIcon={<Lock size={18} />}
              rightIcon={
                <>{showPassword ? <EyeOff onClick={() => setShowPassword(!showPassword)} size={18} /> : <Eye onClick={() => setShowPassword(!showPassword)} size={18} />}</>
              }
              error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : ""}
            />
          )}
        />

        {/* Forgot Password */}
        <div className="flex justify-end w-full">
          <Link to="/auth/requestPasswordReset" className="text-primary hover:underline hover:text-primaryDark font-medium text-sm">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={!form.state.isValid || loginMutation.isPending}>
          {loginMutation.isPending ? "Logging In..." : "Login your account"}
        </Button>

        {/* Bottom text */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary hover:underline hover:text-primaryDark font-bold">
            Register
          </Link>
        </p>
      </form>
    </RootLayout>
  );
};

export default Login;
