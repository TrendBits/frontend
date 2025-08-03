import { z } from "zod";

export const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const verifyTokenSchema = z.object({
  token: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyTokenParamsType = z.infer<typeof verifyTokenSchema>;
