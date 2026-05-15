import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../../lib/schemas';
import { loginStudent } from '../../lib/api';
import { Button } from '../ui/button';
import { Form, FormField, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setError('');

    try {
      await loginStudent(values);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="student@example.com" {...register('email')} />
        {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
      </FormField>

      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter your password" {...register('password')} />
        {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
      </FormField>

      {error && <p className="error-message">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </Button>
    </Form>
  );
}
