import z from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
  // human: z.boolean().refine((v) => v, "Please verify you are human"),
});

export const signUpSchema = signInSchema
  .extend({
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type SignInFields = z.infer<typeof signInSchema>;
export type SignUpFields = z.infer<typeof signUpSchema>;
export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;
