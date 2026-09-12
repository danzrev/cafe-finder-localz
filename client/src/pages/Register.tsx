import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useAuth, useDocumentTitle } from '@/hooks';
import { ApiError } from '@/api/client';
import { PASSWORD_MIN_LENGTH } from '@cafefinder/shared';
import { Button, Field, Input } from '@/components';

export default function RegisterPage() {
  useDocumentTitle('Create account');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register({ email, password, name: name || undefined });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err as ApiError | string);
      setSubmitting(false);
    }
  };

  const message =
    typeof error === 'object' && error && 'message' in error ? (error as ApiError).message : String(error ?? '');

  return (
    <div className="rounded-dewdrop border border-espresso/10 bg-paper p-8 shadow-soft">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso text-paper">
          <Coffee className="h-6 w-6" />
        </span>
        <h1 className="mt-3 font-display text-2xl font-semibold">Join the community</h1>
        <p className="mt-1 text-sm text-cocoa">Create a free account to save and review cafés.</p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {message || 'We couldn’t create that account.'}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" hint="Optional.">
          <Input
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password" required hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}>
          <Input
            type="password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" loading={submitting} fullWidth>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-cocoa">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-leaf-deep hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}