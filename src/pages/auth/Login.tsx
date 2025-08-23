import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { RootLayout } from "../../components/Layouts";
import { CustomButton, CustomInput } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { loginUser } from "../../api/auth.api";
import { setToken } from "../../util/auth.util";
import { loginSchema, type LoginFormData } from "../../schemas/auth.schema";
import { toast } from "sonner";
import ProtectedNavbar from "@/components/ui/ProtectedNavbar";

const Login = () => {
  const navigate = useNavigate();
  const routeApi = getRouteApi("/auth/_auth/login");
  const { redirect } = routeApi.useSearch();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await loginUser(data);
    },
    onSuccess: (response: any) => {
      setError(null);
      setToken(response.data.access_token);
      navigate({ to: redirect || "/prompt", replace: true });
      toast.success("Login successful!");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormData,
    onSubmit: async ({ value }) => {
      setError(null);
      loginMutation.mutate(value);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <RootLayout className="h-dvh flex flex-col">
      <ProtectedNavbar/>
      <div className="flex-1 flex justify-center items-center">
        {/* Login Form */}
        <div className="flex flex-col items-center justify-center w-full max-w-xs px-8 sm:px-6 md:px-0 gap-5">
          {/* Logo */}
          <div className="flex flex-col items-center mb-5">
            <img src={Logo} alt="TrendBits Logo" className="w-16 h-16" />
            <h2 className="font-fredoka font-medium text-3xl">TrendBits</h2>
          </div>

          {/* Api Error Field */}
          {(loginMutation.isError || error) && (
            <div className="w-full bg-red-100 text-red-800 p-3 rounded-lg mb-2">
              <p className="text-sm">
                {error || 
                 loginMutation.error?.response?.data?.message || 
                 loginMutation.error?.message || 
                 "Login failed. Please check your credentials and try again."}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-5">
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
                <CustomInput
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
                <CustomInput
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
              <Link to="/auth/request-password/reset" className="text-customprimary hover:underline hover:text-primaryDark font-medium text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <CustomButton type="submit" className="w-full" disabled={!form.state.isValid || loginMutation.isPending}>
              {loginMutation.isPending ? "Logging In..." : "Login your account"}
            </CustomButton>
          </form>

          {/* Bottom text */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-customprimary hover:underline hover:text-primaryDark font-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </RootLayout>
  );
};

export default Login;
