import z from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be less than 64 characters")
    .refine((val) => /[a-z]/.test(val), {
      message: "Must contain a lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Must contain an uppercase letter",
    })
    .refine((val) => /\d/.test(val), { message: "Must contain a number" })
    .refine((val) => /[^\w\s]/.test(val), {
      message: "Must contain a special character",
    }),
  // human: z.boolean().refine((v) => v, "Please verify you are human"),
});

export const signUpSchema = signInSchema
  .extend({
    username: z
      .string()
      .regex(
        /^[A-Za-z0-9_]{3,30}$/,
        "Username must be 3–30 chars and contain only letters, numbers, or _"
      ),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be less than 64 characters")
      .refine((val) => /[a-z]/.test(val), {
        message: "Must contain a lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Must contain an uppercase letter",
      })
      .refine((val) => /\d/.test(val), { message: "Must contain a number" })
      .refine((val) => /[^\w\s]/.test(val), {
        message: "Must contain a special character",
      }),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type SignInFields = z.infer<typeof signInSchema>;
export type SignUpFields = z.infer<typeof signUpSchema>;
export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;
export type PasswordResetFields = z.infer<typeof passwordResetSchema>;
