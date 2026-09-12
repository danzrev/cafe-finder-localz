import { useState, type FormEvent } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ownerApi } from '@/services/api';
import { ApiError } from '@/api/client';
import { Button, Field, Input, Textarea } from '@/components';
import { useDocumentTitle } from '@/hooks';

export default function OwnerClaimPage() {
  useDocumentTitle('Claim your café');
  const [cafeId, setCafeId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await ownerApi.claim(cafeId.trim(), message || undefined);
      setSuccess(true);
    } catch (err) {
      const msg =
        typeof err === 'object' && err && 'message' in err ? (err as ApiError).message : 'Something went wrong.';
      setError(msg);
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf/10 text-leaf">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold">Claim submitted</h1>
        <p className="mt-2 text-cocoa">
          Thanks! We’ll verify your ownership and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <header className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-semibold">
          <ShieldCheck className="h-7 w-7 text-leaf" /> Claim your café
        </h1>
        <p className="mt-1 text-cocoa">
          Running one of the cafés listed here? Claim it to manage your menu, hours, and photos.
        </p>
      </header>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-dewdrop border border-espresso/10 bg-latte-light p-6">
        <Field label="Café link or ID" required hint="Paste the café URL (e.g. /cafe/blue-wonder) or its ID.">
          <Input
            required
            value={cafeId}
            onChange={(e) => setCafeId(e.target.value)}
            placeholder="cafe id"
          />
        </Field>
        <Field label="Proof of ownership" hint="Optional. Add a note so our team can verify faster.">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. I’m the manager; my contact is…"
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={submitting}>
            Submit claim
          </Button>
        </div>
      </form>
    </div>
  );
}