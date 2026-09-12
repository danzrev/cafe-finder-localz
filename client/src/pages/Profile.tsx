import { useState, type FormEvent } from 'react';
import { User } from 'lucide-react';
import { useAuth, useDocumentTitle } from '@/hooks';
import { Button, Field, Input } from '@/components';
import { RoleBadge } from '@/components/RoleBadge';

export default function ProfilePage() {
  useDocumentTitle('My profile');
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // Scaffold: pulls user from auth context. Profile editing/update hooks come in a later phase.
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf text-paper">
          {user.name ? user.name[0]?.toUpperCase() : <User className="h-8 w-8" />}
        </span>
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
            {user.name ?? user.email} <RoleBadge role={user.role} />
          </h1>
          <p className="text-cocoa">{user.email}</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-5 rounded-dewdrop border border-espresso/10 bg-latte-light p-6">
        <Field label="Name">
          <Input defaultValue={user.name ?? ''} placeholder="Your name" />
        </Field>
        <Field label="Email" hint="Used to log in. Changing this verifies the new address.">
          <Input defaultValue={user.email} type="email" />
        </Field>
        <div className="flex justify-end">
          <Button type="submit">{saved ? 'Saved ✓' : 'Save changes'}</Button>
        </div>
      </form>
    </div>
  );
}