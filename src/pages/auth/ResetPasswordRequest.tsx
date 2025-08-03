import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { RootLayout } from "../../components/Layouts";
import { Button, Input } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "@tanstack/react-router";
import { requestResetPass } from "../../api/auth.api";

// Zod schema for password recovery form
const passwordRecoverySchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;

// Rate limiting constants
const MAX_REQUESTS_PER_HOUR = 5;
const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = "password_reset_rate_limit";

// Rate limit storage helpers
const getRateLimitData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { requests: 0, lastRequest: 0, cooldownUntil: 0 };

    const parsed = JSON.parse(data);
    const now = Date.now();

    // Reset hourly counter if an hour has passed
    if (now - parsed.lastRequest > 60 * 60 * 1000) {
      return { requests: 0, lastRequest: 0, cooldownUntil: 0 };
    }

    return parsed;
  } catch {
    return { requests: 0, lastRequest: 0, cooldownUntil: 0 };
  }
};

const setRateLimitData = (data: { requests: number; lastRequest: number; cooldownUntil: number }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const RequestResetPassword = () => {
  const navigate = useNavigate();
  const [requestCount, setRequestCount] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isRequestLimited, setIsRequestLimited] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Initialize rate limit state
  useEffect(() => {
    const rateLimitData = getRateLimitData();
    setRequestCount(rateLimitData.requests);

    const now = Date.now();
    if (rateLimitData.cooldownUntil > now) {
      setCooldownRemaining(Math.ceil((rateLimitData.cooldownUntil - now) / 1000));
    }

    setIsRequestLimited(rateLimitData.requests >= MAX_REQUESTS_PER_HOUR);
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldownRemaining]);

  const canMakeRequest = () => {
    return cooldownRemaining === 0 && !isRequestLimited && !emailSent;
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return await requestResetPass(email);
    },
    onSuccess: () => {
      setEmailSent(true);
      
      // Navigate to login after 15 seconds
      setTimeout(() => {
        navigate({ to: "/auth/login" });
      }, 15_000);
    },
    onError: (error: any) => {
      // Error will be handled by the form's error display
      console.error('Reset password error:', error);
    },
  });

  const handleSubmit = async (value: PasswordRecoveryFormData) => {
    if (!canMakeRequest()) return;

    const now = Date.now();
    const newRequestCount = requestCount + 1;
    const cooldownUntil = now + COOLDOWN_SECONDS * 1000;

    // Update rate limit data
    setRateLimitData({
      requests: newRequestCount,
      lastRequest: now,
      cooldownUntil,
    });

    // Update state
    setRequestCount(newRequestCount);
    setCooldownRemaining(COOLDOWN_SECONDS);
    setIsRequestLimited(newRequestCount >= MAX_REQUESTS_PER_HOUR);

    // Make API call
    resetPasswordMutation.mutate(value.email);
  };

  const form = useForm({
    defaultValues: {
      email: "",
    } as PasswordRecoveryFormData,
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
  });

  return (
    <RootLayout className="justify-center items-center flex">
      {/* Password Recovery Form */}
      <div className="flex flex-col items-center justify-center w-full max-w-xs px-8 sm:px-6 md:px-0 gap-6">
        {/* Logo - Only show when email is not sent */}
        {!emailSent && (
          <div className="flex flex-col items-center mb-2">
            <img src={Logo} alt="TrendBits Logo" className="w-12 h-12" />
            {/* <h2 className="font-fredoka font-medium text-3xl">TrendBits</h2> */}
          </div>
        )}

        {emailSent ? (
          // Success State
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">Email Sent!</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Password reset email sent! Check your inbox and spam folder.
            </p>
            <p className="text-gray-500 text-xs">
              Redirecting you to login in a few seconds...
            </p>
          </div>
        ) : (
          // Form State
          <>
            <div className="text-center mb-4">
              <h3 className="text-xl font-medium text-gray-700 mb-2">Forgot Password?</h3>
              <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
            </div>

            {/* API Error Field */}
            {resetPasswordMutation.isError && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                <p className="text-sm text-center">{resetPasswordMutation.error?.message || "Failed to send reset email"}</p>
              </div>
            )}

            <form
              className="w-full space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = passwordRecoverySchema.shape.email.safeParse(value);
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

              {/* Submit Button */}
              <div className="w-full space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!form.state.isValid || resetPasswordMutation.isPending || !canMakeRequest()}
                >
                  {resetPasswordMutation.isPending
                    ? "Sending reset link..."
                    : cooldownRemaining > 0
                      ? `Wait ${cooldownRemaining}s`
                      : isRequestLimited
                        ? "Limit reached"
                        : "Send reset email"}
                </Button>

                {/* Rate limit feedback */}
                {cooldownRemaining > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${((COOLDOWN_SECONDS - cooldownRemaining) / COOLDOWN_SECONDS) * 100}%` }}
                    />
                  </div>
                )}

                {isRequestLimited && (
                  <p className="text-xs text-red-500 text-center">Maximum requests reached. Try again in an hour.</p>
                )}

                {requestCount > 0 && !isRequestLimited && (
                  <p className="text-xs text-gray-500 text-center">
                    {requestCount}/{MAX_REQUESTS_PER_HOUR} requests used this hour
                  </p>
                )}
              </div>
            </form>
          </>
        )}

        {/* Bottom text */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Remember Password?{" "}
          <Link to="/auth/login" className="text-primary hover:underline hover:text-primaryDark font-bold">
            Login
          </Link>
        </p>
      </div>
    </RootLayout>
  );
};

export default RequestResetPassword;
