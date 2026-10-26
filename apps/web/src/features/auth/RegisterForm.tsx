'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Button, FormField, Input } from '@/components/ui';
import { api } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import { GoogleButton } from './GoogleButton';

/** Owner: M2 — Customer registration form submitting to POST /api/v1/auth/register */
export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(form: FormData) {
    setPending(true);
    setError(undefined);

    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const phone = String(form.get('phone') ?? '').trim();

    if (password.length < 8) {
      setPending(false);
      return setError('Password must be at least 8 characters long');
    }

    const { data, error: apiErr } = await api.POST('/api/v1/auth/register', {
      body: {
        name,
        email,
        password,
        phone: phone || undefined,
      },
    });

    setPending(false);

    if (apiErr || !data) {
      return setError(errorMessage(apiErr, 'Registration failed'));
    }

    router.push(data.home ?? '/customer');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error && <Alert tone="error">{error}</Alert>}

      <FormField label="Full name" htmlFor="name">
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="e.g. John Doe"
        />
      </FormField>

      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </FormField>

      <FormField label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </FormField>

      <FormField label="Phone (optional)" htmlFor="phone">
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+94770000000" />
      </FormField>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Creating account…' : 'Create account'}
      </Button>

      <GoogleButton label="Sign up with Google" />

      <p className="pt-2 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
