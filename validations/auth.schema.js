import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'name must be at least 2 characters'),

  email: z.string().trim().toLowerCase().email('email is not valid'),

  password: z
    .string()
    .min(8, 'password must be at least 8 characters')
    .regex(/\d/, 'password must include a number')
    .regex(/[^A-Za-z0-9]/, 'password must include a special character'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('email is not valid'),

  password: z.string().min(1, 'password is required'),
});
