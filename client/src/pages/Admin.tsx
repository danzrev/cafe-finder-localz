import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, ShieldCheck } from 'lucide-react';
import { CafeDetail, ClaimStatus, OwnershipClaim, Paginated, UserProfile } from '@cafefinder/shared';
import { adminApi } from '@/services/api';
import { ApiError } from '@/api/client';
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  Input,
  LoadingState,
  Modal,
  Select,
  Textarea,
} from '@/components';
import { useDocumentTitle } from '@/hooks';
import { cafeStatusLabel, claimStatusLabel } from '@/utils/status';

type Tab = 'cafes' | 'claims' | 'users';

/** Pending moderation queue for admins: cafés, claims, and users. */
export default function AdminPage() {
  useDocumentTitle('Admin');
  const [tab, setTab] = useState<Tab>('cafes');

  const [cafes, setCafes] = useState<CafeDetail[] | null>(null);
  const [claims, setClaims] = useState<OwnershipClaim[] | null>(null);
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [editing, setEditing] = useState<CafeDetail | null>(null);

  const load = {
    cafes: () =>
      adminApi.listCafes({ status: 'PENDING' }).then((r: Paginated<CafeDetail>) => setCafes(r.items)),
    claims: () =>
      adminApi.listClaims({ status: ClaimStatus.PENDING }).then((r: Paginated<OwnershipClaim>) => setClaims(r.items)),
    users: () => adminApi.listUsers().then((r: Paginated<UserProfile>) => setUsers(r.items)),
  };

  useEffect(() => {
    setError(null);
    setCafes(null);
    setClaims(null);
    setUsers(null);
    load[tab]().catch(setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: 'cafes', label: 'Cafés to review' },
    { id: 'claims', label: 'Ownership claims' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <div>
      <header className="mb-8 flex items-center gap-2">
        <ShieldCheck className="h-7 w-7 text-leaf" />
        <h1 className="font-display text-3xl font-semibold">Admin</h1>
      </header>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-ring ${
              tab === t.id ? 'bg-espresso text-paper' : 'bg-latte text-cocoa hover:text-espresso'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <ErrorState onRetry={() => load[tab]().catch(setError)} />
      ) : tab === 'cafes' ? (
        <CafeQueue
          items={cafes}
          onDecision={(id, status) => {
            void adminApi.updateCafeStatus(id, status).catch(() => {});
            load.cafes().catch(() => {});
          }}
          onEdit={setEditing}
        />
      ) : tab === 'claims' ? (
        <ClaimQueue
          items={claims}
          onDecision={(id, decision) => {
            adminApi.decideClaim(id, decision).catch(() => {});
            load.claims().catch(() => {});
          }}
        />
      ) : (
        <UserTable items={users} />
      )}

      <CafeEditModal cafe={editing} onClose={() => setEditing(null)} onSaved={() => load.cafes().catch(() => {})} />
    </div>
  );
}

/* ----- Section renderers ----- */

function CafeQueue({
  items,
  onDecision,
  onEdit,
}: {
  items: CafeDetail[] | null;
  onDecision: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onEdit: (cafe: CafeDetail) => void;
}) {
  if (!items) return <LoadingState />;
  if (!items.length)
    return <EmptyState title="Queue is clear" description="No cafés waiting for review." />;
  return (
    <ul className="divide-y divide-espresso/10 rounded-dewdrop border border-espresso/10">
      {items.map((c) => (
        <li key={c.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-cocoa">{c.district ?? c.city}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-cocoa">
              <StatusDot status={c.status} /> {cafeStatusLabel(c.status)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(c)}>
              Edit
            </Button>
            <Button size="sm" onClick={() => onDecision(c.id, 'APPROVED')}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => onDecision(c.id, 'REJECTED')}>
              Reject
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ClaimQueue({
  items,
  onDecision,
}: {
  items: OwnershipClaim[] | null;
  onDecision: (id: string, decision: 'APPROVED' | 'REJECTED') => void;
}) {
  if (!items) return <LoadingState />;
  if (!items.length)
    return <EmptyState title="No pending claims" description="Ownership requests will appear here." />;
  return (
    <ul className="divide-y divide-espresso/10 rounded-dewdrop border border-espresso/10">
      {items.map((claim) => (
        <li key={claim.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium">Claim for café #{claim.cafeId.slice(0, 8)}</p>
            <p className="text-sm text-cocoa">{claim.message ?? 'No message'}</p>
            <span className="mt-1 inline-flex text-xs text-cocoa">
              {claimStatusLabel(claim.status)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onDecision(claim.id, 'APPROVED')}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => onDecision(claim.id, 'REJECTED')}>
              Reject
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function UserTable({ items }: { items: UserProfile[] | null }) {
  if (!items) return <LoadingState />;
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-espresso/10 text-cocoa">
          <th className="py-2 pr-4 font-medium">User</th>
          <th className="py-2 pr-4 font-medium">Role</th>
          <th className="py-2 font-medium">Joined</th>
        </tr>
      </thead>
      <tbody>
        {items.map((u) => (
          <tr key={u.id} className="border-b border-espresso/5">
            <td className="py-2 pr-4">
              <p className="font-medium">{u.name ?? '—'}</p>
              <p className="text-xs text-cocoa">{u.email}</p>
            </td>
            <td className="py-2 pr-4">{u.role}</td>
            <td className="py-2 text-cocoa">{new Date(u.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusDot({ status }: { status: string }) {
  const dot =
    status === 'APPROVED' ? 'bg-leaf' : status === 'REJECTED' ? 'bg-red-500' : 'bg-mango';
  return <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />;
}

/* ----- Edit café modal ----- */

interface EditForm {
  name: string;
  tagline: string;
  description: string;
  address: string;
  district: string;
  city: string;
  priceLevel: '1' | '2' | '3';
  amenities: string;
}

function CafeEditModal({
  cafe,
  onClose,
  onSaved,
}: {
  cafe: CafeDetail | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<EditForm | null>(cafe ? toForm(cafe) : null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form whenever a different café is opened.
  useEffect(() => {
    setForm(cafe ? toForm(cafe) : null);
    setError(null);
  }, [cafe]);

  if (!cafe || !form) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.updateCafe(cafe.id, {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        address: form.address,
        district: form.district,
        city: form.city,
        priceLevel: Number(form.priceLevel) as 1 | 2 | 3,
        amenities: splitList(form.amenities),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const set = (patch: Partial<EditForm>) => setForm((f) => (f ? { ...f, ...patch } : f));

  return (
    <Modal open onClose={onClose} title={`Edit ${cafe.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" required>
          <Input required value={form.name} onChange={(e) => set({ name: e.target.value })} maxLength={80} />
        </Field>
        <Field label="Tagline">
          <Input value={form.tagline} onChange={(e) => set({ tagline: e.target.value })} maxLength={120} />
        </Field>
        <Field label="Description">
          <Textarea value={form.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Address">
            <Input value={form.address} onChange={(e) => set({ address: e.target.value })} />
          </Field>
          <Field label="District">
            <Input value={form.district} onChange={(e) => set({ district: e.target.value })} />
          </Field>
        </div>
        <Field label="Price level">
          <Select
            value={form.priceLevel}
            onChange={(e) => set({ priceLevel: e.target.value as EditForm['priceLevel'] })}
          >
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
          </Select>
        </Field>
        <Field label="Amenities" hint="Comma-separated.">
          <Input value={form.amenities} onChange={(e) => set({ amenities: e.target.value })} />
        </Field>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function toForm(cafe: CafeDetail): EditForm {
  return {
    name: cafe.name,
    tagline: cafe.tagline ?? '',
    description: cafe.description ?? '',
    address: cafe.address ?? '',
    district: cafe.district ?? '',
    city: cafe.city,
    priceLevel: String(cafe.priceLevel) as EditForm['priceLevel'],
    amenities: (cafe.amenities ?? []).join(', '),
  };
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}