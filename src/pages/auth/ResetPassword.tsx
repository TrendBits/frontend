import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import { useState } from "react";

import { RootLayout } from "../../components/Layouts";
import { CustomButton, CustomInput } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword } from "../../api/auth.api";

// Zod schema for reset password form
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[a-zA-Z])/, "Must contain at least one letter")
    .regex(/(?=.*\d)/, "Must contain at least one number")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Must contain at least one special character"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordProps {
  loaderResult?: {
    success: boolean;
    data?: any;
    token?: string;
  };
}

const ResetPassword = ({ loaderResult }: ResetPasswordProps) => {
  const navigate = useNavigate();
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

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      // Extract email from loaderResult
      const email = loaderResult?.data?.data?.email;
      if (!email) {
        throw new Error("Email not found in verification data");
      }
      
      return await resetPassword(email, data.password);
    },
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate({ to: "/auth/login", replace: true });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reset password");
    },
  });

  const form = useForm({
    defaultValues: {
      password: "",
    } as ResetPasswordFormData,
    onSubmit: async ({ value }) => {
      resetPasswordMutation.mutate(value);
    },
  });

  return (
    <RootLayout className="justify-center items-center flex">
      {/* Reset Password Form */}
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

        {/* Show email if available in loaderResult */}
        {loaderResult?.data?.data?.email && (
          <div className="w-full text-center mb-2">
            <p className="text-sm text-gray-600">Resetting password for:</p>
            <p className="text-sm font-medium text-gray-800">{loaderResult.data.data.email}</p>
          </div>
        )}

        {/* Password Field */}
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = resetPasswordSchema.shape.password.safeParse(value);
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
                  placeholder="New Password"
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full"
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <>{showPassword ? <EyeOff onClick={() => setShowPassword(!showPassword)} size={18} /> : <Eye onClick={() => setShowPassword(!showPassword)} size={18} />}</>
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
        <CustomButton type="submit" className="w-full" disabled={!form.state.isValid || resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? "Resetting Password..." : "Reset Password"}
        </CustomButton>

        {/* Bottom text */}
        <p className="text-center text-sm text-gray-400">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-customprimary hover:underline hover:text-primaryDark font-bold">
            Login
          </Link>
        </p>
      </form>
    </RootLayout>
  );
};

export default ResetPassword;
