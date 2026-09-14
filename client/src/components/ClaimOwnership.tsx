import { useState } from 'react';
import { Building2, CheckCircle, XCircle } from 'lucide-react';
import { Button, Modal, Field, Textarea } from '@/components';
import { ApiError } from '@/api/client';
import { api } from '@/api/client';

interface ClaimOwnershipProps {
  cafeId: string;
  cafeName: string;
  isOwner: boolean;
  hasExistingClaim: boolean;
  onClaimSubmitted?: () => void;
}

export function ClaimOwnership({
  cafeId,
  cafeName,
  isOwner,
  hasExistingClaim,
  onClaimSubmitted,
}: ClaimOwnershipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/owner/claims', {
        cafeId,
        message: message.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setMessage('');
        onClaimSubmitted?.();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to submit claim. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isOwner) {
    return (
      <div className="rounded-dewdrop bg-leaf/10 border border-leaf/20 p-4 flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-leaf-deep flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-leaf-deep">You own this café</p>
          <p className="text-sm text-cocoa mt-1">
            You can manage this listing from your{' '}
            <a href="/owner" className="underline hover:text-leaf-deep">
              owner dashboard
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  if (hasExistingClaim) {
    return (
      <div className="rounded-dewdrop bg-mango/10 border border-mango/20 p-4 flex items-start gap-3">
        <Building2 className="h-5 w-5 text-mango-deep flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-mango-deep">Claim pending</p>
          <p className="text-sm text-cocoa mt-1">
            Your ownership claim is being reviewed by our admin team. Check your{' '}
            <a href="/owner/claims" className="underline hover:text-mango-deep">
              claims status
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        icon={<Building2 className="h-5 w-5" />}
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto"
      >
        Claim Ownership
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => !submitting && setIsOpen(false)}
        title="Claim Café Ownership"
      >
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-leaf mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-espresso mb-2">
              Claim submitted!
            </h3>
            <p className="text-cocoa">
              We'll review your claim and get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-cocoa mb-4">
                Claiming ownership of <strong className="text-espresso">{cafeName}</strong> will
                allow you to:
              </p>
              <ul className="space-y-2 text-sm text-cocoa">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-leaf-deep flex-shrink-0 mt-0.5" />
                  Update café details, photos, and hours
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-leaf-deep flex-shrink-0 mt-0.5" />
                  Respond to reviews and engage with customers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-leaf-deep flex-shrink-0 mt-0.5" />
                  Add special offers and announcements
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-leaf-deep flex-shrink-0 mt-0.5" />
                  Access analytics and insights
                </li>
              </ul>
            </div>

            <Field label="Additional information (optional)">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your connection to this café (e.g., owner, manager, authorized representative)..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-cocoa-light mt-1">
                {message.length}/500 characters
              </p>
            </Field>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
                className="flex-1"
              >
                Submit Claim
              </Button>
            </div>

            <p className="text-xs text-cocoa-light text-center">
              By submitting, you confirm that you are authorized to manage this café listing.
            </p>
          </form>
        )}
      </Modal>
    </>
  );
}
