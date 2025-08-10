import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Mail, Check, X } from "lucide-react";
import { useState } from "react";

import { RootLayout } from "../../components/Layouts";
import { CustomButton, CustomInput } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/auth.api";
import { toast } from "sonner";
import ProtectedNavbar from "@/components/ui/ProtectedNavbar";
import { isDisposableEmail } from "@/util/disposable-email.util";

// Zod schema for registration form (removed disposable email check)
const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[a-zA-Z])/, "Must contain at least one letter")
    .regex(/(?=.*\d)/, "Must contain at least one number")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Must contain at least one special character"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      return await registerUser(data);
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate({ to: "/auth/login", replace: true });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as RegisterFormData,
    onSubmit: async ({ value }) => {
      // Prevent default form submission
      // e.preventDefault(); // This is handled by TanStack Form
      
      // Run form validation
      const validationResult = registerSchema.safeParse(value);
      
      if (!validationResult.success) {
        const newErrors: Record<string, string> = {};
        
        // Handle Zod validation errors
        validationResult.error?.errors?.forEach((error) => {
          const field = error.path[0] as string;
          newErrors[field] = error.message;
        });
        
        setValidationErrors(newErrors);
        return;
      }
      
      // Check for disposable email at submission
      if (isDisposableEmail(value.email)) {
        setValidationErrors({ email: "Temporary or disposable email addresses are not allowed. Please use a permanent email address." });
        return;
      }
      
      // Clear any previous errors
      setValidationErrors({});
      
      // Proceed with registration
      registerMutation.mutate(value);
    },
  });

  return (
    <RootLayout className="h-dvh flex flex-col">
      <ProtectedNavbar/>
      <div className="flex-1 flex justify-center items-center">
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

          {/* Api Error Field */}
          {registerMutation.isError && (
            <div className="w-full bg-red-100 text-red-800 p-3 rounded-lg mb-2">
              <p className="text-sm">{registerMutation.error.message}</p>
            </div>
          )}
          
          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                // Only check basic email format on change
                const basicResult = registerSchema.shape.email.safeParse(value);
                if (!basicResult.success) {
                  return basicResult.error.errors[0]?.message;
                }
                return undefined;
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
                error={
                  (field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : "") ||
                  validationErrors.email ||
                  ""
                }
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
                    error={
                      (field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : "") ||
                      validationErrors.password ||
                      ""
                    }
                  />

                  {/* Password Requirements */}
                  <div className="mt-3 space-y-1 flex flex-wrap gap-1.5">
                    {requirementsList.map((requirement) => (
                      <div key={requirement.key} className={`flex items-center gap-1 h-full px-1.5 py-1 rounded ${requirement.met ? "bg-green-100" : "bg-gray-100"}`}>
                        {requirement.met ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-gray-500" />}
                        <span className={`text-xs font-medium ${requirement.met ? "text-green-600" : "text-gray-500"}`}>{requirement.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />

          {/* Submit CustomButton */}
          <CustomButton type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating Account..." : "Register an account"}
          </CustomButton>

          {/* Bottom text */}
          <p className="text-center text-sm text-gray-400">
            Have an account?{" "}
            <Link to="/auth/login" className="text-customprimary hover:underline hover:text-primaryDark font-bold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </RootLayout>
  );
};

export default Register;
