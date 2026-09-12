import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useAuth, useDocumentTitle } from '@/hooks';
import { ApiError } from '@/api/client';
import { Button, Field, Input } from '@/components';

export default function LoginPage() {
  useDocumentTitle('Log in');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
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
        <h1 className="mt-3 font-display text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-cocoa">Log in to save cafés and leave reviews.</p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {message || 'Invalid email or password.'}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Field label="Password" required>
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" loading={submitting} fullWidth>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-cocoa">
        New to Café Finder?{' '}
        <Link to="/register" className="font-medium text-leaf-deep hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}