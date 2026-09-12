import { CafeStatus, ClaimStatus, OpenStatus, PostStatus } from '@cafefinder/shared';

/** Human-readable label for an open/discovery status. */
export function openStatusLabel(status: OpenStatus): string {
  switch (status) {
    case 'OPEN':
      return 'Open now';
    case 'CLOSED':
      return 'Closed';
    default:
      return 'Unknown';
  }
}

/** Human-readable label for a café publishing/status. */
export function cafeStatusLabel(status: CafeStatus): string {
  switch (status) {
    case 'APPROVED':
      return 'Approved';
    case 'PENDING':
      return 'Pending review';
    case 'REJECTED':
      return 'Rejected';
    case 'CLOSED':
      return 'Closed';
    default:
      return 'Draft';
  }
}

/** Human-readable label for an ownership claim status. */
export function claimStatusLabel(status: ClaimStatus): string {
  switch (status) {
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Pending';
  }
}

/** Human-readable label for a blog post status. */
export function postStatusLabel(status: PostStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Published';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return 'Draft';
  }
}