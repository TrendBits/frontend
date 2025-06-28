import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

import { RootLayout } from "../../components/Layouts";
import { Button, Input } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { Link } from "@tanstack/react-router";

// Zod schema for registration form
const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[a-zA-Z])/, "Must contain at least one letter")
    .regex(/(?=.*\d)/, "Must contain at least one number")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Must contain at least one special character"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as RegisterFormData,
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <RootLayout className="justify-center items-center flex">
      {/* Registration Form */}
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
              const result = registerSchema.shape.email.safeParse(value);
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
              const result = registerSchema.shape.password.safeParse(value);
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

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={!form.state.isValid || form.state.isSubmitting}>
          {form.state.isSubmitting ? "Creating Account..." : "Register an account"}
        </Button>

        {/* Bottom text */}
        <p className="text-center text-sm text-gray-400">
          Have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline hover:text-primaryDark font-bold">
            Login
          </Link>
        </p>
      </form>
    </RootLayout>
  );
};

export default Register;
