import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const passwordOptional = z
  .string()
  .optional()
  .transform((value) => (value?.trim().length ? value : undefined))
  .refine((value) => value === undefined || value.length >= 8, {
    message: 'Password must be at least 8 characters',
  });

export const studentCreateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  dateOfBirth: z.string().min(10, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
  address: z.string().min(5, 'Address is required'),
  courseEnrolled: z.string().min(2, 'Course is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const studentUpdateSchema = studentCreateSchema.extend({ password: passwordOptional });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type StudentCreateFormValues = z.infer<typeof studentCreateSchema>;
export type StudentUpdateFormValues = z.infer<typeof studentUpdateSchema>;
