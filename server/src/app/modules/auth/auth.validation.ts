import z from "zod";
import { Role } from "../user/user.type";

export const userRegisterZodSchema = z.object({
  firstName: z
    .string("First name must be a string")
    .nonempty({ error: "First name can't be blank" })
    .min(2, { error: "First name must be at least 2 characters long." })
    .max(50, { error: "First name can't be more than 50 characters." }),

  lastName: z
    .string("Last name must be a string")
    .nonempty({ error: "Last name can't be blank" })
    .min(2, { error: "Last name must be at least 2 characters long." })
    .max(50, { error: "Last name can't be more than 50 characters." }),

  email: z
    .email({ error: "Invalid email format" })
    .nonempty({ error: "Email can't be blank" }),

  password: z
    .string("Password must be a string")
    .nonempty({ error: "Password can't be blank" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
      message:
        "Password must include at least 1 uppercase, 1 lowercase, and 1 special character (! @ # $ % ^ & *)",
    }),
  role: z
    .enum(Role, {
      error: `Role must be one of: ${Object.values(Role).join(", ")}`,
    })
    .optional()
    .default(Role.STUDENT),
});

export const userLoginZodSchema = z.object({
  email: z
    .email({ error: "Invalid email format" })
    .nonempty({ error: "Email can't be blank" }),
  password: z
    .string("Password must be a string")
    .nonempty({ error: "Password can't be blank" }),
});

export const changePasswordZodSchema = z.object({
  oldPassword: z
    .string("Old password must be a string")
    .nonempty({ error: "Old password can't be blank" }),
  newPassword: z
    .string("New password must be a string")
    .nonempty({ error: "New password can't be blank" })
    .min(8, { message: "New password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
      message:
        "New password must include at least 1 uppercase, 1 lowercase, and 1 special character (! @ # $ % ^ & *)",
    }),
});
