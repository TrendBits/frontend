import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

import { RootLayout } from "../../components/Layouts";
import { Button, Input } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { Link } from "@tanstack/react-router";

// Zod schema for login form
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormData,
    onSubmit: async ({ value }) => {
      console.log(value);
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
        <div className="flex flex-col items-center mb-3">
          <img src={Logo} alt="TrendBits Logo" className="w-10 h-10" />
          <h2 className="font-fredoka font-medium text-2xl">TrendBits</h2>
        </div>

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
                <>
                  {showPassword ? (
                    <EyeOff onClick={() => setShowPassword(!showPassword)} size={18} />
                  ) : (
                    <Eye onClick={() => setShowPassword(!showPassword)} size={18} />
                  )}
                </>
              }
              error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : ""}
            />
          )}
        />

        {/* Forgot Password */}
        <div className="flex justify-end w-full">
          <Link to="/auth/login" className="text-primary hover:underline hover:text-primaryDark font-medium text-sm">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={!form.state.isValid || form.state.isSubmitting}>
          {form.state.isSubmitting ? "Logging In..." : "Login your account"}
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
