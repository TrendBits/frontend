import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { User, Mail, Settings, Shield, Edit3, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouteContext } from "@tanstack/react-router";

import { RootLayout } from "../../components/Layouts";
import { CustomButton, CustomInput } from "../../components/ui";
import { requestResetPass, updateUsername } from "../../api/auth.api";

// Zod schemas
const usernameSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(30, "Username must be less than 30 characters"),
});

const passwordResetSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type UsernameFormData = z.infer<typeof usernameSchema>;
type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

// Rate limiting constants (reused from reset password request)
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

interface ProfileProps {
  userProfile?: {
    username: string;
    email: string;
    created_at?: string;
  };
  isLoading?: boolean;
}

const Profile = ({ userProfile: propUserProfile, isLoading = false }: ProfileProps = {}) => {
  // Get user profile data from route context or props
  const routeContext = useRouteContext({ from: '/_protected/_auth/profile' as any });
  const userProfile = propUserProfile || routeContext?.userProfile;

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(userProfile?.username || "User");
  const [currentEmail,] = useState(userProfile?.email || "");
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

  // Username update mutation - now using the real API
  const updateUsernameMutation = useMutation({
    mutationFn: async (username: string) => {
      return await updateUsername(username);
    },
    onSuccess: () => {
      setIsEditingUsername(false);
      toast.success("Username updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update username");
    },
  });

  // Password reset mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return await requestResetPass(email);
    },
    onSuccess: () => {
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
      
      // Reset email sent state after 5 minutes
      setTimeout(() => {
        setEmailSent(false);
      }, 5 * 60 * 1000);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send reset email");
    },
  });

  // Username form
  const usernameForm = useForm({
    defaultValues: {
      username: currentUsername,
    } as UsernameFormData,
    onSubmit: async ({ value }) => {
      setCurrentUsername(value.username);
      updateUsernameMutation.mutate(value.username);
    },
  });

  // Password reset form
  const passwordResetForm = useForm({
    defaultValues: {
      email: currentEmail,
    } as PasswordResetFormData,
    onSubmit: async ({ value }) => {
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
    },
  });

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    usernameForm.handleSubmit();
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    passwordResetForm.handleSubmit();
  };

  // Skeleton Loader Component
  const ProfileSkeleton = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-customprimary/30 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-customprimary/20 rounded w-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information Card Skeleton */}
        <div className="bg-secondaryBg rounded-xl shadow-sm border border-customprimary/20 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-customprimary/20 rounded-full"></div>
            <div className="h-6 bg-customprimary/25 rounded w-1/2"></div>
          </div>
          
          {/* Username Section Skeleton */}
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-customprimary/20 rounded w-1/4 mb-2"></div>
              <div className="h-10 bg-customprimary/15 rounded w-full"></div>
            </div>
            
            {/* Email Section Skeleton */}
            <div>
              <div className="h-4 bg-customprimary/20 rounded w-1/4 mb-2"></div>
              <div className="h-10 bg-customprimary/15 rounded w-full"></div>
            </div>
          </div>
        </div>

        {/* Password Reset Card Skeleton */}
        <div className="bg-secondaryBg rounded-xl shadow-sm border border-customprimary/20 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-customprimary/20 rounded-full"></div>
            <div className="h-6 bg-customprimary/25 rounded w-1/2"></div>
          </div>
          
          <div className="space-y-4">
            <div className="h-4 bg-customprimary/20 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-customprimary/15 rounded w-full mb-4"></div>
            <div className="h-10 bg-customprimary/20 rounded w-full"></div>
          </div>
        </div>
      </div>

      {/* Additional Settings Card Skeleton */}
      <div className="mt-8 bg-secondaryBg rounded-xl shadow-sm border border-customprimary/20 p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-customprimary/20 rounded-full"></div>
          <div className="h-6 bg-customprimary/25 rounded w-1/2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-customprimary/20 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-customprimary/15 rounded w-1/4"></div>
          </div>
          <div>
            <div className="h-4 bg-customprimary/20 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-customprimary/15 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show skeleton loader when loading
  if (isLoading) {
    return (
      <RootLayout className="animate-slide-up">
        <ProfileSkeleton />
      </RootLayout>
    );
  }

  return (
    <RootLayout className="animate-slide-up">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-fredoka font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Card */}
          <div className="bg-secondaryBg rounded-xl shadow-sm border border-customprimary/20 p-6 animate-slide-in-left hover:shadow-lg hover:border-customprimary/30 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-customprimary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-customprimary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>

            {/* Username Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                {isEditingUsername ? (
                  <form onSubmit={handleUsernameSubmit} className="space-y-3">
                    <usernameForm.Field
                      name="username"
                      validators={{
                        onChange: ({ value }) => {
                          const result = usernameSchema.shape.username.safeParse(value);
                          return result.success ? undefined : result.error.errors[0]?.message;
                        },
                      }}
                      children={(field) => (
                        <CustomInput
                          type="text"
                          name={field.name}
                          placeholder="Enter username"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full"
                          leftIcon={<Edit3 size={18} />}
                          error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : ""}
                        />
                      )}
                    />
                    <div className="flex gap-2">
                      <CustomButton
                        type="submit"
                        size="sm"
                        disabled={!usernameForm.state.isValid || updateUsernameMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        <Check size={16} />
                        {updateUsernameMutation.isPending ? "Saving..." : "Save"}
                      </CustomButton>
                      <CustomButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingUsername(false);
                          usernameForm.reset();
                        }}
                        className="flex items-center gap-1"
                      >
                        <X size={16} />
                        Cancel
                      </CustomButton>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-mainBg rounded-lg border border-customprimary/10">
                    <span className="text-gray-900 font-medium">{currentUsername}</span>
                    <CustomButton
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingUsername(true)}
                      className="flex items-center gap-1"
                    >
                      <Edit3 size={16} />
                      Edit
                    </CustomButton>
                  </div>
                )}
              </div>

              {/* Email Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-3 bg-mainBg rounded-lg border border-customprimary/10">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{currentEmail}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-secondaryBg rounded-xl shadow-sm border border-customprimary/20 p-6 animate-slide-in-right hover:shadow-lg hover:border-customprimary/30 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>

            {/* Password Reset Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Request a password reset link to be sent to your email address.
                </p>

                {emailSent ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-bounce-subtle">
                    <div className="flex items-center gap-2 text-green-800">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Email Sent!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Password reset email sent! Check your inbox and spam folder.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                    {resetPasswordMutation.isError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg animate-fade-in-up">
                        <p className="text-sm">{resetPasswordMutation.error?.message || "Failed to send reset email"}</p>
                      </div>
                    )}

                    <passwordResetForm.Field
                      name="email"
                      validators={{
                        onChange: ({ value }) => {
                          const result = passwordResetSchema.shape.email.safeParse(value);
                          return result.success ? undefined : result.error.errors[0]?.message;
                        },
                      }}
                      children={(field) => (
                        <CustomInput
                          type="email"
                          name={field.name}
                          placeholder="Your email address"
                          value={currentEmail}
                          onChange={() => {}}
                          onBlur={() => {}}
                          className="w-full bg-gray-50 cursor-not-allowed"
                          leftIcon={<Mail size={18} />}
                          disabled={true}
                          error={""}
                        />
                      )}
                    />

                    <div className="space-y-2">
                      <CustomButton
                        type="submit"
                        variant="outline"
                        className="w-full"
                        disabled={!passwordResetForm.state.isValid || resetPasswordMutation.isPending || !canMakeRequest()}
                      >
                        {resetPasswordMutation.isPending
                          ? "Sending reset link..."
                          : cooldownRemaining > 0
                          ? `Wait ${cooldownRemaining}s`
                          : isRequestLimited
                          ? "Limit reached"
                          : "Send Password Reset Email"}
                      </CustomButton>

                      {/* Rate limit feedback */}
                      {cooldownRemaining > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-customprimary h-1 rounded-full transition-all duration-1000"
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
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings Card */}
        <div className="mt-8 bg-secondaryBg rounded-xl shadow-sm border border-customprimary/20 p-6 animate-fade-in-up-delay hover:shadow-lg hover:border-customprimary/30 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-slide-in-left">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Account Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-900">Active</span>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Member Since</h3>
              <span className="text-sm text-gray-900">
                {userProfile?.created_at 
                  ? new Date(userProfile.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })
                  : 'July 2025'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Profile;