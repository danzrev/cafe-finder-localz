import { UserRole } from '@cafefinder/shared';
import { cn } from '@/utils/cn';

const TONES: Record<UserRole, string> = {
  USER: 'bg-crema text-cocoa',
  OWNER: 'bg-leaf/10 text-leaf-deep',
  ADMIN: 'bg-espresso text-paper',
};

const LABELS: Record<UserRole, string> = {
  USER: 'Member',
  OWNER: 'Owner',
  ADMIN: 'Admin',
};

/** Small pill showing a user's role. */
export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONES[role],
        className
      )}
    >
      {LABELS[role]}
    </span>
  );
}