import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Mail, Check, X } from "lucide-react";
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

  const checkPasswordRequirements = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasLetter: /(?=.*[a-zA-Z])/.test(password),
      hasNumber: /(?=.*\d)/.test(password),
      hasSpecial: /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
    };
  };

  const getRequirementsList = (requirements: ReturnType<typeof checkPasswordRequirements>) => [
    { key: "minLength", label: "Minimum 8 characters", met: requirements.minLength },
    { key: "hasLetter", label: "At least 1 letter", met: requirements.hasLetter },
    { key: "hasNumber", label: "At least 1 number", met: requirements.hasNumber },
    { key: "hasSpecial", label: "At least 1 special character", met: requirements.hasSpecial },
  ];

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
        className="flex flex-col items-center justify-center w-full max-w-xs px-6 sm:px-0 gap-5"
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

        {/* Email Field */}
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

        {/* Password Field */}
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = registerSchema.shape.password.safeParse(value);
              return result.success ? undefined : result.error.errors[0]?.message;
            },
          }}
          children={(field) => {
            const requirements = checkPasswordRequirements(field.state.value);
            const requirementsList = getRequirementsList(requirements);

            return (
              <div className="w-full">
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
                />

                {/* Password Requirements */}
                <div className="mt-3 space-y-1 flex flex-wrap gap-1.5">
                  {requirementsList.map((requirement) => (
                    <div
                      key={requirement.key}
                      className={`flex items-center gap-1 h-full px-1.5 py-1 rounded ${requirement.met ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      {requirement.met ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <X size={14} className="text-gray-500" />
                      )}
                      <span className={`text-xs font-medium ${requirement.met ? "text-green-600" : "text-gray-500"}`}>
                        {requirement.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
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
