import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  studentCreateSchema,
  studentUpdateSchema,
  type StudentCreateFormValues,
  type StudentUpdateFormValues,
} from '../../lib/schemas';
import { Button } from '../ui/button';
import { Form, FormField, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { StudentData } from '../../lib/api';

interface StudentFormProps {
  student?: StudentData;
  submitLabel: string;
  onSubmit: (values: StudentCreateFormValues | StudentUpdateFormValues) => Promise<void>;
  onCancel?: () => void;
}

export function StudentForm({ student, submitLabel, onSubmit, onCancel }: StudentFormProps) {
  const isEdit = Boolean(student?._id);
  const defaultGender = (student?.gender as StudentUpdateFormValues['gender']) ?? 'Male';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentCreateFormValues | StudentUpdateFormValues>({
    resolver: zodResolver(isEdit ? studentUpdateSchema : studentCreateSchema),
    defaultValues: {
      fullName: student?.fullName ?? '',
      email: student?.email ?? '',
      phone: student?.phone ?? '',
      dateOfBirth: student?.dateOfBirth ?? '',
      gender: defaultGender,
      address: student?.address ?? '',
      courseEnrolled: student?.courseEnrolled ?? '',
      password: '',
    },
  });

  useEffect(() => {
    reset({
      fullName: student?.fullName ?? '',
      email: student?.email ?? '',
      phone: student?.phone ?? '',
      dateOfBirth: student?.dateOfBirth ?? '',
      gender: defaultGender,
      address: student?.address ?? '',
      courseEnrolled: student?.courseEnrolled ?? '',
      password: '',
    });
  }, [student, reset, defaultGender]);

  const handleFormSubmit: SubmitHandler<StudentCreateFormValues | StudentUpdateFormValues> = async (values) => {
    await onSubmit(values);
    reset()
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormField>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" type="text" placeholder="Jane Doe" {...register('fullName')} />
        {errors.fullName && <FormMessage>{errors.fullName.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="student@example.com" {...register('email')} />
        {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="123-456-7890" {...register('phone')} />
        {errors.phone && <FormMessage>{errors.phone.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
        {errors.dateOfBirth && <FormMessage>{errors.dateOfBirth.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="gender">Gender</Label>
        <select id="gender" className="input" {...register('gender')}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>
        {errors.gender && <FormMessage>{errors.gender.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" rows={4} placeholder="123 Main Street" {...register('address')} />
        {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="courseEnrolled">Course Enrolled</Label>
        <Input id="courseEnrolled" type="text" placeholder="Computer Science" {...register('courseEnrolled')} />
        {errors.courseEnrolled && <FormMessage>{errors.courseEnrolled.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder={isEdit ? 'Leave blank to keep current password' : 'Create a password'}
          {...register('password')}
        />
        {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
      </FormField>

      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? `${submitLabel}…` : submitLabel}
        </Button>
        {isEdit && onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
}
