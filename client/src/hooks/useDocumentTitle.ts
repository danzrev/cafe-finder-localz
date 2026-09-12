import { useEffect } from 'react';

/** Keep the document <title> in sync with the current view. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · Café Finder Localz` : 'Café Finder Localz';
    return () => {
      document.title = previous;
    };
  }, [title]);
}