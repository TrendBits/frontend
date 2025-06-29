import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";

import { RootLayout } from "../../components/Layouts";
import { Button, Input } from "../../components/ui";
import Logo from "../../assets/logo.png";
import { Link } from "@tanstack/react-router";

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
  const [requestCount, setRequestCount] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isRequestLimited, setIsRequestLimited] = useState(false);

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
    return cooldownRemaining === 0 && !isRequestLimited;
  };

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

    // TODO: Make actual API call
    console.log("Password reset requested for:", value.email);
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

        {/* Form Fields */}
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
            disabled={!form.state.isValid || form.state.isSubmitting || !canMakeRequest()}
          >
            {form.state.isSubmitting
              ? "Sending reset link..."
              : cooldownRemaining > 0
                ? `Wait ${cooldownRemaining}s`
                : isRequestLimited
                  ? "Limit reached"
                  : "Send reset link"}
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

export default RequestResetPassword;
