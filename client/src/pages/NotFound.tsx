import { Link } from 'react-router-dom';
import { CoffeeGlyph } from '@/components/Card';
import { Button } from '@/components';
import { useDocumentTitle } from '@/hooks';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
      <CoffeeGlyph className="h-12 w-12 text-leaf" />
      <p className="font-display text-3xl font-semibold">That page got cold.</p>
      <p className="max-w-sm text-cocoa">
        We couldn’t find what you were looking for. The link may be broken, or it never existed.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}